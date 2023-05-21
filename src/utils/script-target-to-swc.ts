import * as ts from "typescript";
import type SWCTypes from "@swc/core";

/**
 * Converts TypeScript script target to SWC JscTarget.
 * @param {ts.ScriptTarget | undefined} scriptTarget - The TypeScript script target.
 * @returns {SWCTypes.JscTarget} - The corresponding SWC JscTarget.
 *
 * @example
 * // Returns "es5"
 * scriptTargetToSWC(ts.ScriptTarget.ES5);
 *
 * @example
 * // Returns "es2016"
 * scriptTargetToSWC(ts.ScriptTarget.ES2016);
 *
 * @example
 * // Returns "esnext"
 * scriptTargetToSWC(ts.ScriptTarget.Latest);
 *
 * @example
 * // Returns "esnext"
 * scriptTargetToSWC(undefined);
 */
function scriptTargetToSWC(scriptTarget: ts.ScriptTarget | undefined): SWCTypes.JscTarget {
  switch (scriptTarget) {
    case ts.ScriptTarget.ES3:
      return "es3";
    case ts.ScriptTarget.ES5:
      return "es5";
    case ts.ScriptTarget.ES2015:
      return "es2015";
    case ts.ScriptTarget.ES2016:
      return "es2016";
    case ts.ScriptTarget.ES2017:
      return "es2017";
    case ts.ScriptTarget.ES2018:
      return "es2018";
    case ts.ScriptTarget.ES2019:
      return "es2019";
    case ts.ScriptTarget.ES2020:
      return "es2020";
    case ts.ScriptTarget.ES2021:
      return "es2021";
    case ts.ScriptTarget.ES2022:
      return "es2022";
    case ts.ScriptTarget.ESNext:
    case ts.ScriptTarget.Latest:
      return "esnext";
    default:
      // Could make it the most compatible version, but that's probably not what the user wants.
      return "esnext";
  }
}

export default scriptTargetToSWC;
