import * as ts from "typescript";
import type SWCTypes from "@swc/core";

/**
 * Converts TypeScript module kind to SWC module type.
 * @param {ts.ModuleKind | undefined} moduleKind - The TypeScript module kind.
 * @returns {SWCTypes.ModuleConfig["type"]} - The corresponding SWC module type.
 *
 * @example
 * // Returns "amd"
 * moduleKindToSWC(ts.ModuleKind.AMD);
 *
 * @example
 * // Returns "umd"
 * moduleKindToSWC(ts.ModuleKind.UMD);
 *
 * @example
 * // Returns "nodenext"
 * moduleKindToSWC(ts.ModuleKind.ES2020);
 *
 * @example
 * // Returns "commonjs"
 * moduleKindToSWC(undefined);
 */
function moduleKindToSWC(moduleKind: ts.ModuleKind | undefined): SWCTypes.ModuleConfig["type"] {
  switch (moduleKind) {
    case ts.ModuleKind.AMD:
      return "amd";
    case ts.ModuleKind.UMD:
      return "umd";
    case ts.ModuleKind.System:
      return "systemjs";
    case ts.ModuleKind.ES2015:
      // Assuming "es2015" corresponds to "es6" in SWC.
      return "es6";
    case ts.ModuleKind.ES2020:
    case ts.ModuleKind.ESNext:
      return "nodenext";
    case ts.ModuleKind.None:
    case ts.ModuleKind.CommonJS:
    default:
      return "commonjs";
  }
}

export default moduleKindToSWC;
