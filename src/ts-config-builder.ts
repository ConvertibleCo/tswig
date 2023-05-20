import * as ts from "typescript";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Logger } from './utils';
import { TypeScriptConfigBuilderError, FileSystemError } from './errors';

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
      this.tmpFile = path.join(os.tmpdir(), "tmp.tsconfig.json");
      try {
        fs.writeFileSync(this.tmpFile, JSON.stringify(config), {
          encoding: "utf8",
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
   * @returns {{ config?: any, error?: ts.Diagnostic }} The configuration object or an error object.
   */
  private readConfigFile() {
    try {
      return ts.readConfigFile(this.configFileName, ts.sys.readFile);
    } catch (err) {
      Logger.error("Error reading the config file.");
      throw new TypeScriptConfigBuilderError(`Error reading the config file: ${(err as Error).message}`);
    }
  }

  /**
   * Parses the content of the configuration file.
   * @private
   * @param {any} config - The configuration object.
   * @returns {ts.ParsedCommandLine} The parsed command-line options.
   */
  private parseJsonConfigFileContent(config: ts.TsConfigSourceFile) {
    try {
      const host = {
        useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
        readDirectory: ts.sys.readDirectory,
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
      };
      return ts.parseJsonSourceFileConfigFileContent(
        config,
        host,
        "./",
        undefined,
        this.configFileName,
      );
    } catch (err) {
      Logger.error("Error parsing the config file content.");
      throw new TypeScriptConfigBuilderError(`Error parsing the config file content: ${(err as Error).message}`);
    }
  }

  /**
   * Loads and parses TypeScript configurations.
   * @returns {ts.CompilerOptions} The compiler options from the configuration file.
   * @example
   * const builder = new TypeScriptConfigBuilder();
   * const compilerOptions = builder.loadConfigurations();
   */
  loadConfigurations() {
    const { config, error } = this.readConfigFile();
    if (error) {
      this.cleanupTmpFile();
      throw new TypeScriptConfigBuilderError(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
    }
    Logger.info(`Config file ${this.configFileName} read successfully.`);
    const parsedConfig = this.parseJsonConfigFileContent(config);
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
      throw new TypeScriptConfigBuilderError(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
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
        fs.unlinkSync(this.tmpFile);
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
