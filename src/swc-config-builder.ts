import * as ts from "typescript";
import type SWCTypes from "@swc/core";
import {SWCConversionError, SWCOverrideError} from "./errors";
import {deepMerge, moduleKindToSWC, scriptTargetToSWC, Logger} from "./utils";


/**
 * @typedef {Object} SWCOptions - The options for the SwcConfigBuilder.
 * @property {any} swc - The SwcConfigBuilder options.
 */
interface SWCOptions {
  swc: any;
}

/**
 * `SwcConfigBuilder` class to convert TypeScript configuration to SwcConfigBuilder configuration
 * @class
 */
class SwcConfigBuilder {
  private _swc: any;

  /**
   * Creates an instance of `SwcConfigBuilder`.
   *
   * @param {SWCOptions} param - The SwcConfigBuilder options.
   * @example
   * const swcConfig = new SwcConfigBuilder({ swc: generatedSwcConfig });
   */
  constructor(param: SWCOptions) {
    this._swc = param.swc;
  }

  /**
   * Determines whether esModuleInterop is enabled in the TypeScript configuration.
   *
   * @param {ts.CompilerOptions} tsconfig - The TypeScript configuration.
   * @returns {boolean | undefined} - Whether esModuleInterop is enabled.
   * @example
   * const esModuleInterop = SwcConfigBuilder.esModuleInterop(tsconfig);
   * if (esModuleInterop) {
   *   // Do something
   * }
   */
  static esModuleInterop(tsconfig: ts.CompilerOptions): boolean | undefined {
    return tsconfig.esModuleInterop;
  }

  /**
   * Determines whether source maps are enabled in the TypeScript configuration.
   *
   * @param {ts.CompilerOptions} tsconfig - The TypeScript configuration.
   * @returns {boolean | undefined} - Whether source maps are enabled.
   * @example
   * const sourceMaps = SwcConfigBuilder.sourceMaps(tsconfig);
   * if (sourceMaps) {
   *   // Do something
   * }
   */
  static sourceMaps(tsconfig: ts.CompilerOptions): boolean | undefined {
    return tsconfig.sourceMap;
  }

  /**
   * Retrieves the module type from the TypeScript configuration.
   *
   * @param {ts.CompilerOptions} tsconfig - The TypeScript configuration.
   * @returns {string | undefined} - The module type.
   * @example
   * const moduleType = SwcConfigBuilder.moduleType(tsconfig);
   * if (moduleType === ts.ModuleKind.ESNext) {
   *   // Do something
   * }
   */
  static moduleType(tsconfig: ts.CompilerOptions): ts.ModuleKind | undefined {
    const module = tsconfig.module;
    /**
     * if we don't cast to any, we get the following error:
     * TS2367: This comparison appears to be unintentional because the types ... and 'ModuleKind.None' have no overlap.
     */
    return module && module !== (ts.ModuleKind.None as any) ? module : undefined;
  }

  /**
   * Determines whether strict mode is enabled in the TypeScript configuration.
   *
   * @param {ts.CompilerOptions} tsconfig - The TypeScript configuration.
   * @returns {boolean | undefined} - Whether strict mode is enabled.
   * @example
   * const strictMode = SwcConfigBuilder.strictMode(tsconfig);
   * if (strictMode) {
   *   // Do something
   * }
   */
  static strictMode(tsconfig: ts.CompilerOptions): boolean | undefined {
    const alwaysStrict = tsconfig.alwaysStrict;
    const noImplicitUseStrict = tsconfig.noImplicitUseStrict;
    if (alwaysStrict !== undefined || noImplicitUseStrict !== undefined) {
      return alwaysStrict || !noImplicitUseStrict;
    }
    return undefined;
  }

  /**
   * Retrieves the React-specific configuration from the TypeScript configuration.
   *
   * @param {ts.CompilerOptions} tsconfig - The TypeScript configuration.
   * @returns {any | undefined} - The React configuration.
   * @example
   * const reactConfig = SwcConfigBuilder.reactConfig(tsconfig);
   * if (reactConfig) {
   *   // Do something
   * }
   */
  static reactConfig(tsconfig: ts.CompilerOptions): SWCTypes.ReactConfig {
    const jsx = tsconfig.jsx;
    if (!jsx) return {};

    return {
      throwIfNamespace: false,
      development: jsx === ts.JsxEmit.ReactJSXDev,
      pragma: tsconfig.jsxFactory || "React.createElement",
      pragmaFrag: tsconfig.jsxFragmentFactory || "React.Fragment",
      importSource: tsconfig.jsxImportSource || "",
      runtime:
        jsx === ts.JsxEmit.ReactJSX || jsx === ts.JsxEmit.ReactJSXDev
          ? "automatic"
          : "classic",
    };
  }

  /**
   * Determines if the compiler options are not set to 'es3', 'es5', 'es6', or 'es2015', which would suggest the usage of class names.
   *
   * @param {ts.ScriptTarget | undefined} target - The target prop from TypeScript compiler options.
   * @returns {boolean} - True if the script target is not 'es3', 'es5', 'es6', or 'es2015', suggesting that class names are to be kept; otherwise, false.
   * @example
   * // Example usage:
   * const tsconfig = {
   *   target: ts.ScriptTarget.ESNext,
   *   module: ts.ModuleKind.CommonJS,
   * };
   * const result = keepClassNames(tsconfig);
   * console.log(result); // Output: true
   */
  static keepClassNames(target: ts.ScriptTarget | undefined): boolean {
    return !["es3", "es5", "es6", "es2015"].includes(scriptTargetToSWC(target));
  }


  /**
   * Checks if the given module type and target indicate an ECMAScript module (ESM).
   *
   * @param {ts.ModuleKind} moduleType - The module type to check.
   * @param {ts.ScriptTarget} target - The target ECMAScript version to check.
   * @returns {boolean} - True if the module type and target indicate an ECMAScript module; otherwise, false.
   * @example
   * // Example usage:
   * const moduleType = ts.ModuleKind.ESNext;
   * const target = ts.ScriptTarget.ES2021;
   * const result = isESM(moduleType, target);
   * console.log(result); // Output: true
   */
  static isESM(
    moduleType: ts.ModuleKind | undefined,
    target: ts.ScriptTarget | undefined,
  ): boolean {
    if (!moduleType || !target) return false;
    return (
      moduleType >= ts.ModuleKind.ESNext && target >= ts.ScriptTarget.ES2015
    );
  }

  /**
   * Generates the SwcConfigBuilder configuration from the TypeScript configuration.
   *
   * @param {ts.CompilerOptions} tsconfig - The TypeScript configuration.
   * @returns {any} - The generated SwcConfigBuilder configuration.
   * @throws {SWCConversionError} - If an error occurs during the conversion process.
   * @example
   * const generatedSwcConfig = SwcConfigBuilder.generateSwcConfig(tsconfig, true);
   */
  static generateSwcConfig(tsconfig: ts.CompilerOptions): SWCTypes.Options {
    try {
      const isReact = Boolean(this.reactConfig(tsconfig));
      const moduleType = this.moduleType(tsconfig);

      const isESM = SwcConfigBuilder.isESM(moduleType, tsconfig.target);
      const isMultiPackageRepo = tsconfig.outDir && !tsconfig.rootDir;

      let config: SWCTypes.Options = {
        sourceMaps: Boolean(this.sourceMaps(tsconfig)),
        module: {
          type: moduleKindToSWC(moduleType) as any,
          strictMode: this.strictMode(tsconfig),
          noInterop: Boolean(!this.esModuleInterop(tsconfig)),
          importInterop: this.esModuleInterop(tsconfig) ? "swc": undefined,
        },
        jsc: {
          externalHelpers: Boolean(tsconfig.importHelpers),
          target: scriptTargetToSWC(tsconfig.target),
          parser: {
            syntax: "typescript",
            tsx: isReact,
            decorators: Boolean(tsconfig.experimentalDecorators),
            dynamicImport: isESM,
          },
          transform: {
            legacyDecorator: Boolean(tsconfig.experimentalDecorators),
            decoratorMetadata: Boolean(tsconfig.emitDecoratorMetadata),
            ...(isReact ? { react: this.reactConfig(tsconfig) } : {}),
          },
          keepClassNames: this.keepClassNames(tsconfig.target),
          paths: isMultiPackageRepo ? {} : tsconfig.paths as { [key: string]: string[] } || {},
          baseUrl: (isMultiPackageRepo ? tsconfig.outDir : tsconfig.baseUrl) as unknown as any,
        },
      };

      // Additional adjustments
      if (tsconfig.allowJs) {
        config = deepMerge(config, {
          jsc: {
            parser: {
              syntax: "ecmascript",
            },
          },
        });
      }

      if (tsconfig.allowSyntheticDefaultImports && config.module?.type !== "systemjs" && !config.module?.noInterop) {
        config = deepMerge(config, {
          module: {
            noInterop: false,
            importInterop: "none",
          } satisfies SWCTypes.BaseModuleConfig,
        });
      }

      Logger.info("Generated Swc configuration!");
      return JSON.parse(JSON.stringify(config));
    } catch (error) {
      Logger.error("Failed to generate Swc configuration");
      throw new SWCConversionError(
        `Failed to generate SWC configuration: ${(error as Error)?.message}`,
      );
    }
  }

  /**
   * Converts the TypeScript configuration to SwcConfigBuilder configuration.
   *
   * @param {ts.CompilerOptions} tsconfig - The TypeScript configuration to convert.
   * @returns {SwcConfigBuilder} - The converted SwcConfigBuilder configuration.
   * @throws {SWCConversionError} - If an error occurs during the conversion process.
   * @example
   * const tsconfig = {
   *   compilerOptions: {
   *     target: 'es2019',
   *   },
   * };
   * const swcConfig = SwcConfigBuilder.fromTsConfig(tsconfig);
   */
  static fromTsConfig(
    tsconfig: ts.CompilerOptions,
  ): SwcConfigBuilder {
    if(!Boolean(tsconfig) || !Object.keys(tsconfig).length) {
      Logger.error("No TypeScript configuration provided to SwcConfigBuilder.fromTsConfig()")
      throw new SWCConversionError("No TypeScript configuration provided");
    }
    try {
      Logger.info("Starting swc conversion...");
      return new SwcConfigBuilder({
        swc: this.generateSwcConfig(tsconfig),
      });
    } catch (error) {
      Logger.error("Failed to convert TypeScript configuration to Swc configuration");
      throw new SWCConversionError(
        `Failed to convert TypeScript configuration to SWC configuration: ${
          (error as Error).message
        }`,
      );
    }
  }

  /**
   * Overrides the SwcConfigBuilder configuration with additional SwcConfigBuilder-specific options.
   *
   * @param {any} swcOptions - Additional SwcConfigBuilder-specific options to include.
   * @returns {SwcConfigBuilder} - The overridden SwcConfigBuilder configuration.
   * @throws {SWCOverrideError} - If an error occurs during the override process.
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
   * const overriddenConfig = swcConfig.overrides(swcOptions);
   */
  overrides(swcOptions: any = {}): this {
    try {
      Logger.info("Merging SwcConfigBuilder options...");
      const result = deepMerge(this._swc, swcOptions);
      Logger.info("Conversion complete.");
      this._swc = result;
      return this
    } catch (error) {
      Logger.error("Failed to override Swc configuration");
      throw new SWCOverrideError(
        `Failed to override SWC configuration: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Converts the internal _swc property to an object.
   * This method is helpful when we need to directly access the SWC configuration data in a structured format.
   * It enables the utilization of the SWC configuration data within other parts of the application that may require this information as a JSON object.
   *
   * @returns {SWCTypes.Options} - The _swc property as an object.
   * @example
   * const swcConfig = new SwcConfigBuilder({ swc: generatedSwcConfig });
   * const swcObject = swcConfig.toObject();
   * console.log(swcObject.module.type); // Access module type in the SWC configuration
   */
  toObject(): SWCTypes.Options {
    return this._swc;
  }

  /**
   * Converts the internal _swc property to a string.
   * This method is beneficial when we need to represent the SWC configuration as a string, for example, when creating .swcrc files.
   * The resulting string is a JSON formatted string with indents for readability.
   *
   * @returns {string} - The _swc property as a string.
   * @example
   * const swcConfig = new SwcConfigBuilder({ swc: generatedSwcConfig });
   * const swcString = swcConfig.toString();
   * console.log(swcString); // Prints SWC configuration as a formatted JSON string
   */
  toString(): string {
    return JSON.stringify(this._swc, null, 2);
  }
}

export default SwcConfigBuilder;
