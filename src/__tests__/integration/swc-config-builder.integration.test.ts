import * as ts from "typescript";
import SwcConfigBuilder from "../../swc-config-builder";
import {SWCConversionError} from "../../errors";

describe("SwcConfigBuilder Integration", () => {
  let tsconfig: { compilerOptions: ts.CompilerOptions; references?: ts.ProjectReference[] };

  beforeEach(() => {
    tsconfig = {
      compilerOptions: {
        esModuleInterop: true,
        sourceMap: true,
        module: ts.ModuleKind.CommonJS,
        strict: true,
        noImplicitUseStrict: false,
        jsx: ts.JsxEmit.ReactJSX,
        jsxFactory: "React.createElement",
        jsxFragmentFactory: "React.Fragment",
        jsxImportSource: "react",
        target: ts.ScriptTarget.ES2018,
        allowJs: false,
        strictNullChecks: true,
        moduleResolution: ts.ModuleResolutionKind.Node10,
        allowSyntheticDefaultImports: true,
      },
      references: [{path: "./path1"}, {path: "./path2"}],
    };
  });

  it("should generate the SwcConfigBuilder configuration and override it from parsed tsconfig", () => {
    const swc = SwcConfigBuilder.fromTsConfig(tsconfig.compilerOptions);

    const swcOptions = {
      jsc: {
        transform: {
          react: {
            throwIfNamespace: true,
          },
        },
      },
    };

    const overrideResult = swc.overrides(swcOptions);

    expect(overrideResult.jsc).toBeDefined();
    expect(overrideResult.jsc!.transform).toBeDefined();
    expect(overrideResult.jsc!.transform!.react).toBeDefined();
    expect(overrideResult.jsc!.transform!.react!.throwIfNamespace).toBe(true);
  });

  it("should throw an error if an exception occurs during the conversion and override process", () => {
    const invalidTsConfig = undefined
    //@ts-expect-error
    expect(() => { SwcConfigBuilder.fromTsConfig(invalidTsConfig) }).toThrowError(SWCConversionError);
  });
});
