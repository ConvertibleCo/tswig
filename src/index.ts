import TypeScriptConfigBuilder from "./ts-config-builder";
import SwcConfigBuilder from "./swc-config-builder";

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
 * const convertedConfig = tswig.convert('tsconfig.json', swcOptions);
 */
function convert(tsconfig: string | object = "tsconfig.json", swcOptions = {}) {
  const tsConfigBuilder = new TypeScriptConfigBuilder(tsconfig);
  const config = tsConfigBuilder.loadConfigurations();

  return SwcConfigBuilder.fromTsConfig(config).overrides(
    swcOptions,
  );
}


export {convert};
