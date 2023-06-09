import { readConfigFile, sys, parseJsonConfigFileContent, flattenDiagnosticMessageText } from "typescript";
import { writeFileSync, unlinkSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join, dirname, basename } from "path";
import { Logger } from "./utils";
import { TypeScriptConfigBuilderError, FileSystemError } from "./errors";

/**
 * Manages TypeScript configurations.
 * @class
 */
class TypeScriptConfigBuilder {
  /**
   * The name of the configuration file.
   * @private
   * @type {string}
   */
  private readonly configFileName: string;
  /**
   * The path of the temporary file used for configuration object.
   * @private
   * @type {string|null}
   */
  private tmpFile: string | null = null;

  /**
   * @constructor
   * @param {string|object} [config='tsconfig.json'] - The name of the configuration file or the configuration object.
   */
  constructor(config: string | object = "tsconfig.json") {
    if (typeof config === "string") {
      this.configFileName = config;
    } else {
      this.tmpFile = join(tmpdir(), "tmp.tsconfig.json");
      try {
        writeFileSync(this.tmpFile, JSON.stringify(config), {
          encoding: "utf8",
          mode: 0o644,
        });
        this.configFileName = this.tmpFile;
        Logger.info(`Temporary file ${this.tmpFile} created.`);
      } catch (err) {
        Logger.error("Error writing the temporary file.");
        throw new FileSystemError(`FileSystemError: ${(err as Error).message}`);
      }
    }
  }

  /**
   * Reads a TypeScript configuration file.
   * @private
   * @returns {{ config?: any, error?: Diagnostic }} The configuration object or an error object.
   */
  private readConfigFile() {
    try {
      return readConfigFile(this.configFileName, sys.readFile);
    } catch (err) {
      Logger.error("Error reading the config file.");
      throw new TypeScriptConfigBuilderError(`Error reading the config file: ${(err as Error).message}`);
    }
  }

  /**
   * Parses the content of the configuration file.
   * @private
   * @param {any} config - The configuration object.
   * @returns {ParsedCommandLine} The parsed command-line options.
   */
  private parseJsonConfigFileContent(config: any) {
    const dir = dirname(this.configFileName);
    const base = basename(this.configFileName);
    // Check if the referenced paths exist
    const references = config.references || [];
    for (const reference of references) {
      const referencePath = join(dir, reference.path);
      if (!existsSync(referencePath)) {
        throw new TypeScriptConfigBuilderError(`Referenced path '${referencePath}' does not exist.`);
      }
    }
    try {
      const host = {
        useCaseSensitiveFileNames: sys.useCaseSensitiveFileNames,
        readDirectory: sys.readDirectory,
        fileExists: sys.fileExists,
        readFile: sys.readFile,
      };
      return parseJsonConfigFileContent(
        config,
        host,
        dir,
        undefined,
        base,
      );
    } catch (err) {
      Logger.error("Error parsing the config file content.");
      throw new TypeScriptConfigBuilderError(`Error parsing the config file content: ${(err as Error).message}`);
    }
  }

  /**
   * Loads and parses TypeScript configurations.
   * @returns {CompilerOptions} The compiler options from the configuration file.
   * @example
   * const builder = new TypeScriptConfigBuilder();
   * const compilerOptions = builder.loadConfigurations();
   */
  loadConfigurations() {
    const { config, error } = this.readConfigFile();
    if (error) {
      this.cleanupTmpFile();
      throw new TypeScriptConfigBuilderError(flattenDiagnosticMessageText(error.messageText, "\n"));
    }
    Logger.info(`Config file ${this.configFileName} read successfully.`);
    const parsedConfig = this.parseJsonConfigFileContent(config);
    // It would be nice in the future if we could merge
    // tsconfig.json and a partial config object passed in
    // this could allow for more flexibility and remove some issues
    if(this.tmpFile) {
      delete parsedConfig.options.baseUrl;
    }

    this.cleanupTmpFile();
    return parsedConfig.options;
  }

  /**
   * Retrieves the file references from the TypeScript configuration.
   * @returns {string[]} An array of file names.
    * @example
   * const builder = new TypeScriptConfigBuilder();
   * const references = builder.getReferences();
   */
  public getReferences() {
    const { config, error } = this.readConfigFile();
    if (error) {
      this.cleanupTmpFile();
      throw new TypeScriptConfigBuilderError(flattenDiagnosticMessageText(error.messageText, "\n"));
    }
    Logger.info(`Config file ${this.configFileName} read successfully.`);
    const parsedConfig = this.parseJsonConfigFileContent(config);
    this.cleanupTmpFile();
    return parsedConfig.fileNames;
  }

  /**
   * Cleans up the temporary file if it was created.
   * @private
   */
  private cleanupTmpFile() {
    if (this.tmpFile) {
      try {
        unlinkSync(this.tmpFile);
        Logger.info(`Temporary file ${this.tmpFile} deleted.`);
      } catch (err) {
        Logger.error("Error deleting the temporary file.");
        throw new FileSystemError(`FileSystemError: ${(err as Error).message}`);
      }
      this.tmpFile = null;
    }
  }
}

export default TypeScriptConfigBuilder;
