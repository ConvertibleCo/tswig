import * as ts from "typescript";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

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
   * Indicates whether to log verbose messages.
   * @private
   * @type {boolean}
   */
  private readonly verbose: boolean;

  /**
   * Creates an instance of TypeScriptConfigBuilder.
   * @constructor
   * @param {string|object} [config='tsconfig.json'] - The name of the configuration file or the configuration object.
   * @param {boolean} [verbose=false] - Indicates whether to log verbose messages.
   */
  constructor(config: string | object = "tsconfig.json", verbose = false) {
    this.verbose = false;
    this.verbose = verbose;

    if (typeof config === "string") {
      this.configFileName = config;
    } else {
      this.tmpFile = path.join(os.tmpdir(), "tmp.tsconfig.json");
      try {
        fs.writeFileSync(this.tmpFile, JSON.stringify(config), {
          encoding: "utf8",
        });
        this.configFileName = this.tmpFile;
        if (this.verbose) {
          console.log(`Temporary file ${this.tmpFile} created.`);
        }
      } catch (err) {
        console.error("Error writing the temporary file:", err);
        throw err;
      }
    }
  }

  /**
   * Reads a TypeScript configuration file.
   * @private
   * @returns {{ config?: any, error?: ts.Diagnostic }} The configuration object or an error object.
   */
  private readConfigFile() {
    return ts.readConfigFile(this.configFileName, ts.sys.readFile);
  }

  /**
   * Parses the content of the configuration file.
   * @private
   * @param {any} config - The configuration object.
   * @returns {ts.ParsedCommandLine} The parsed command-line options.
   */
  private parseJsonConfigFileContent(config: ts.TsConfigSourceFile) {
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
      console.error(
        "Error reading the config file:",
        ts.flattenDiagnosticMessageText(error.messageText, "\n"),
      );
      throw new Error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
    }
    if (this.verbose) {
      console.log(`Config file ${this.configFileName} read successfully.`);
    }
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
  getReferences() {
    const { config, error } = this.readConfigFile();
    if (error) {
      this.cleanupTmpFile();
      console.error(
        "Error reading the config file:",
        ts.flattenDiagnosticMessageText(error.messageText, "\n"),
      );
      throw new Error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
    }
    if (this.verbose) {
      console.log(`Config file ${this.configFileName} read successfully.`);
    }
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
        if (this.verbose) {
          console.log(`Temporary file ${this.tmpFile} deleted.`);
        }
      } catch (err) {
        console.error("Error deleting the temporary file:", err);
      }
      this.tmpFile = null;
    }
  }
}

export default TypeScriptConfigBuilder;
