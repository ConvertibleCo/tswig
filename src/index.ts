import type SWCTypes from "@swc/core";
import TypeScriptConfigBuilder from "./ts-config-builder";
import SwcConfigBuilder from "./swc-config-builder";

/**
 * Convert a TypeScript configuration to an equivalent SwcConfigBuilder configuration.
 *
 * @static
 * @param {string | object} [params.tsconfig='tsconfig.json'] - The TypeScript configuration to convert.
 * @param {SWCTypes.Options} [params.swcOptions={}] - Additional SwcConfigBuilder-specific options to include in the conversion.
 * @returns {SwcConfigBuilder} - The converted SwcConfigBuilder configuration.
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
 * const convertedConfig = tswig.convert({ swcOptions });
 * console.log(convertedConfig.toString());
 * // Output: { your converted config }
 */
function convert(params : {tsconfig?: string | object, swcOptions?: SWCTypes.Config }): SwcConfigBuilder {
  // solving TypeError: Cannot read properties of undefined (reading 'tsconfig')
  if(params === undefined) {
    params = {};
  }

  const { tsconfig = "tsconfig.json", swcOptions = {} } = params;
  const tsConfigBuilder = new TypeScriptConfigBuilder(tsconfig);
  const config = tsConfigBuilder.loadConfigurations();

  return SwcConfigBuilder.fromTsConfig(config).overrides(
    swcOptions,
  );
}


export { convert };
