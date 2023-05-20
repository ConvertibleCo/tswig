import TypeScriptConfigBuilder from "./ts-config-builder";
import SwcConfigBuilder from "./swc-config-builder";

/**
 * The main entry point for the TSWIG package.
 */
class tswig {
  private static getVerbose(): boolean {
    return process.env["TSWIG_VERBOSE"] === "true";
  }

  /**
   * Convert a TypeScript configuration to an equivalent SwcConfigBuilder configuration.
   *
   * @static
   * @param {string | object} tsconfig - The TypeScript configuration to convert.
   * @param {object} [swcOptions={}] - Additional SwcConfigBuilder-specific options to include in the conversion.
   * @returns {object} - The converted SwcConfigBuilder configuration.
   * @example
   * const swcOptions = {
   *   jsc: {
   *     transform: {
   *       react: {
   *         throwIfNamespace: true,
   *       },
   *     },
   *   },
   * };
   * const convertedConfig = tswig.Convert('tsconfig.json', swcOptions);
   */
  static Convert(tsconfig: string | object = "tsconfig.json", swcOptions = {}) {
    const verbose = tswig.getVerbose();
    const tsConfigBuilder = new TypeScriptConfigBuilder(tsconfig, verbose);
    const config = tsConfigBuilder.loadConfigurations();


    return SwcConfigBuilder.fromTsConfig(config, verbose).overrides(
      swcOptions,
      verbose,
    );
  }


  /**
   * Logs a message if verbose mode is enabled.
   *
   * @static
   * @param {string} message - The message to log.
   * @param {boolean} verbose - Whether verbose logging is enabled.
   */
  static log(message: string, verbose: boolean): void {
    if (verbose) {
      console.log(message);
    }
  }
}

export default tswig;
