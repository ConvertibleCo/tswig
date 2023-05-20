import * as ts from "typescript";
import SwcConfigBuilder from "../../swc-config-builder";
import * as utils from "../../utils";
import { SWCConversionError, SWCOverrideError } from "../../errors";

describe("SwcConfigBuilder", () => {
  describe("esModuleInterop", () => {

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return true if esModuleInterop is enabled", () => {
      const tsconfig = {
        compilerOptions: {
          esModuleInterop: true,
        },
      };

      const result = SwcConfigBuilder.esModuleInterop(tsconfig.compilerOptions);

      expect(result).toBe(true);
    });

    it("should return false if esModuleInterop is disabled", () => {
      const tsconfig = {
        compilerOptions: {
          esModuleInterop: false,
        },
      };

      const result = SwcConfigBuilder.esModuleInterop(tsconfig.compilerOptions);

      expect(result).toBe(false);
    });

    it("should return undefined if esModuleInterop is not set", () => {
      const tsconfig = {
        compilerOptions: {},
      };

      const result = SwcConfigBuilder.esModuleInterop(tsconfig.compilerOptions);

      expect(result).toBeUndefined();
    });
  });

  describe("sourceMaps", () => {

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return true if sourceMap is enabled", () => {
      const tsconfig = {
        compilerOptions: {
          sourceMap: true,
        },
      };

      const result = SwcConfigBuilder.sourceMaps(tsconfig.compilerOptions);

      expect(result).toBe(true);
    });

    it("should return false if sourceMap is disabled", () => {
      const tsconfig = {
        compilerOptions: {
          sourceMap: false,
        },
      };

      const result = SwcConfigBuilder.sourceMaps(tsconfig.compilerOptions);

      expect(result).toBe(false);
    });

    it("should return undefined if sourceMap is not set", () => {
      const tsconfig = {
        compilerOptions: {},
      };

      const result = SwcConfigBuilder.sourceMaps(tsconfig.compilerOptions);

      expect(result).toBeUndefined();
    });
  });

  describe("moduleType", () => {

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return the module type if it is set", () => {
      const tsconfig = {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
        },
      };

      const result = SwcConfigBuilder.moduleType(tsconfig.compilerOptions);

      expect(result).toBe(ts.ModuleKind.ESNext);
    });

    it("should return undefined if module type is not set", () => {
      const tsconfig = {
        compilerOptions: {},
      };

      const result = SwcConfigBuilder.moduleType(tsconfig.compilerOptions);

      expect(result).toBeUndefined();
    });

    it("should return undefined if module type is ModuleKind.None", () => {
      const tsconfig = {
        compilerOptions: {
          module: ts.ModuleKind.None,
        },
      };

      const result = SwcConfigBuilder.moduleType(tsconfig.compilerOptions);

      expect(result).toBeUndefined();
    });
  });

  describe("strictMode", () => {

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should return true if strict mode is enabled", () => {
      const tsconfig = {
        compilerOptions: {
          alwaysStrict: true,
          noImplicitUseStrict: false,
        },
      };

      const result = SwcConfigBuilder.strictMode(tsconfig.compilerOptions);

      expect(result).toBe(true);
    });

    it("should return false if strict mode is disabled", () => {
      const tsconfig = {
        compilerOptions: {
          alwaysStrict: false,
          noImplicitUseStrict: true,
        },
      };

      const result = SwcConfigBuilder.strictMode(tsconfig.compilerOptions);

      expect(result).toBe(false);
    });

    it("should return undefined if strict mode is not set", () => {
      const tsconfig = {
        compilerOptions: {},
      };

      const result = SwcConfigBuilder.strictMode(tsconfig.compilerOptions);

      expect(result).toBeUndefined();
    });
  });

  describe("reactConfig", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return the React configuration if JSX is enabled", () => {
      const tsconfig = {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          jsxFactory: "React.createElement",
          jsxFragmentFactory: "React.Fragment",
          jsxImportSource: "react",
        },
      };

      const result = SwcConfigBuilder.reactConfig(tsconfig.compilerOptions);

      expect(result).toEqual({
        throwIfNamespace: false,
        development: false,
        pragma: "React.createElement",
        pragmaFrag: "React.Fragment",
        importSource: "react",
        runtime: "automatic",
      });
    });

    it("should return the default React configuration if JSX is enabled with no settings", () => {
      const tsconfig = {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
        },
      };

      const result = SwcConfigBuilder.reactConfig(tsconfig.compilerOptions);

      expect(result).toEqual({
        throwIfNamespace: false,
        development: false,
        pragma: "React.createElement",
        pragmaFrag: "React.Fragment",
        importSource: "",
        runtime: "automatic",
      });
    });

    it("should return return in development if in dev", () => {
      const tsconfig = {
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSXDev,
        },
      };

      const result = SwcConfigBuilder.reactConfig(tsconfig.compilerOptions);

      expect(result).toEqual({
        throwIfNamespace: false,
        development: true,
        pragma: "React.createElement",
        pragmaFrag: "React.Fragment",
        importSource: "",
        runtime: "automatic",
      });
    });

    it("should return return in classic jsx is React", () => {
      const tsconfig = {
        compilerOptions: {
          jsx: ts.JsxEmit.React,
        },
      };

      const result = SwcConfigBuilder.reactConfig(tsconfig.compilerOptions);

      expect(result).toEqual({
        throwIfNamespace: false,
        development: false,
        pragma: "React.createElement",
        pragmaFrag: "React.Fragment",
        importSource: "",
        runtime: "classic",
      });
    });


    it("should return undefined if JSX is disabled", () => {
      const tsconfig = {
        compilerOptions: {
          jsx: ts.JsxEmit.None,
        },
      };

      const result = SwcConfigBuilder.reactConfig(tsconfig.compilerOptions);

      expect(result).toEqual({});
    });
  });

  describe("isESM", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("should return true if the module type and target indicate an ECMAScript module", () => {
      const moduleType = ts.ModuleKind.ESNext;
      const target = ts.ScriptTarget.ES2021;

      const result = SwcConfigBuilder.isESM(moduleType, target);

      expect(result).toBe(true);
    });

    it("should return false if the module type is undefined", () => {
      const moduleType = undefined;
      const target = ts.ScriptTarget.ES2021;

      const result = SwcConfigBuilder.isESM(moduleType, target);

      expect(result).toBe(false);
    });

    it("should return false if the target is undefined", () => {
      const moduleType = ts.ModuleKind.ESNext;
      const target = undefined;

      const result = SwcConfigBuilder.isESM(moduleType, target);

      expect(result).toBe(false);
    });

    it("should return false if both module type and target are undefined", () => {
      const moduleType = undefined;
      const target = undefined;

      const result = SwcConfigBuilder.isESM(moduleType, target);

      expect(result).toBe(false);
    });

    it("should return false if the module type is less than ESNext", () => {
      const moduleType = ts.ModuleKind.CommonJS;
      const target = ts.ScriptTarget.ES2021;

      const result = SwcConfigBuilder.isESM(moduleType, target);

      expect(result).toBe(false);
    });

    it("should return false if the target is less than ES2015", () => {
      const moduleType = ts.ModuleKind.ESNext;
      const target = ts.ScriptTarget.ES3;

      const result = SwcConfigBuilder.isESM(moduleType, target);

      expect(result).toBe(false);
    });
  });

  describe("generateSwcConfig", () => {

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should generate the SwcConfigBuilder configuration from the TypeScript configuration", () => {
      const tsconfig = {
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

      const result = SwcConfigBuilder.generateSwcConfig(
        tsconfig.compilerOptions,
      );

      expect(result).toEqual({
        module: {
          noInterop: false,
          importInterop: "none",
          type: "commonjs",
          strictMode: true,
        },
        jsc: {
          externalHelpers: false,
          keepClassNames: true,
          target: "es2018",
          parser: {
            syntax: "typescript",
            tsx: true,
            dynamicImport: false,
            decorators: false,
          },
          paths: {},
          transform: {
            legacyDecorator: false,
            decoratorMetadata: false,
            react: {
              pragma: "React.createElement",
              pragmaFrag: "React.Fragment",
              importSource: "react",
              runtime: "automatic",
              throwIfNamespace: false,
              development: false,
            },
            optimizer: {
              globals: {
                vars: {
                  __NULLABLE_CHECK__: true,
                },
              },
            },
          },
        },
        sourceMaps: true,
      });
    });


    it("should throw SwcConfigBuilderConversionError if an error occurs during the conversion process", () => {
      const tsconfig = {
        compilerOptions: {
          strict: true,
        },
      };

      jest.spyOn(utils, "deepMerge").mockImplementation(() => {
        throw new Error("Some error");
      });

      expect(() => {
        SwcConfigBuilder.generateSwcConfig(tsconfig.compilerOptions);
      }).toThrowError(SWCConversionError);
    });
  });


  describe("fromTsConfig", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should convert the TypeScript configuration to SwcConfigBuilder configuration", () => {
      const tsconfig = {
        compilerOptions: {
          target: ts.ScriptTarget.ES2019,
        },
      };

      jest.spyOn(SwcConfigBuilder, "generateSwcConfig").mockReturnValue({});

      const result = SwcConfigBuilder.fromTsConfig(tsconfig.compilerOptions);

      expect(result).toBeInstanceOf(SwcConfigBuilder);
      expect(SwcConfigBuilder.generateSwcConfig).toHaveBeenCalledWith(
        tsconfig.compilerOptions,
      );
    });

    it("should throw SwcConfigBuilderConversionError if an error occurs during the conversion process", () => {
      const tsconfig = {
        compilerOptions: {},
      };

      jest
        .spyOn(SwcConfigBuilder, "generateSwcConfig")
        .mockImplementation(() => {
          throw new Error("Some error");
        });

      expect(() => {
        SwcConfigBuilder.fromTsConfig(tsconfig.compilerOptions);
      }).toThrowError(SWCConversionError);
    });
  });

  describe("overrides", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should override the SWC configuration with additional SWC-specific options", () => {
      const swcOptions = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: true,
            },
          },
        },
      };

      const mergedOptions = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: true,
            },
          },
        },
      };

      jest.spyOn(utils, "deepMerge").mockReturnValue(mergedOptions);

      const swc = new SwcConfigBuilder({ swc: {} });
      const result = swc.overrides(swcOptions);

      expect(result).toBe(mergedOptions);
      expect(utils.deepMerge).toHaveBeenCalledWith({}, swcOptions);
    });

    it("should throw SWCOverrideError if an error occurs during the override process", () => {
      const swcOptions = {};

      jest.spyOn(utils, "deepMerge").mockImplementation(() => {
        throw new Error("Some error");
      });

      const swc = new SwcConfigBuilder({ swc: {} });

      expect(() => {
        swc.overrides(swcOptions);
      }).toThrowError(SWCOverrideError);
    });

    it("should override the SWC configuration when SWC options are provided", () => {
      const swcOptions = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: true,
            },
          },
        },
        module: {
          type: ts.ModuleKind.ESNext,
        },
      };

      const initialConfig = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: false,
            },
          },
        },
        module: {
          type: ts.ModuleKind.CommonJS,
        },
      };

      const mergedOptions = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: true,
            },
          },
        },
        module: {
          type: ts.ModuleKind.ESNext,
        },
      };

      jest.spyOn(utils, "deepMerge").mockReturnValue(mergedOptions);

      const swc = new SwcConfigBuilder({ swc: initialConfig });
      const result = swc.overrides(swcOptions);

      expect(result).toBe(mergedOptions);
      expect(utils.deepMerge).toHaveBeenCalledWith(initialConfig, swcOptions);
    });

    it("should override the SWC configuration when SWC options are an empty object", () => {
      const swcOptions = {};

      const initialConfig = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: false,
            },
          },
        },
        module: {
          type: ts.ModuleKind.CommonJS,
        },
      };

      const mergedOptions = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: false,
            },
          },
        },
        module: {
          type: ts.ModuleKind.CommonJS,
        },
      };

      jest.spyOn(utils, "deepMerge").mockReturnValue(mergedOptions);

      const swc = new SwcConfigBuilder({ swc: initialConfig });
      const result = swc.overrides(swcOptions);

      expect(result).toBe(mergedOptions);
      expect(utils.deepMerge).toHaveBeenCalledWith(initialConfig, swcOptions);
    });

    it("should throw SWCOverrideError if an error occurs during the override process when SWC options are provided", () => {
      const swcOptions = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: true,
            },
          },
        },
        module: {
          type: ts.ModuleKind.ESNext,
        },
      };

      const initialConfig = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: false,
            },
          },
        },
        module: {
          type: ts.ModuleKind.CommonJS,
        },
      };

      jest.spyOn(utils, "deepMerge").mockImplementation(() => {
        throw new Error("Some error");
      });

      const swc = new SwcConfigBuilder({ swc: initialConfig });

      expect(() => {
        swc.overrides(swcOptions);
      }).toThrowError(SWCOverrideError);
    });

    it("should throw SWCOverrideError if an error occurs during the override process when SWC options are an empty object", () => {
      const swcOptions = {};

      const initialConfig = {
        jsc: {
          transform: {
            react: {
              throwIfNamespace: false,
            },
          },
        },
        module: {
          type: ts.ModuleKind.CommonJS,
        },
      };

      jest.spyOn(utils, "deepMerge").mockImplementation(() => {
        throw new Error("Some error");
      });

      const swc = new SwcConfigBuilder({ swc: initialConfig });

      expect(() => {
        swc.overrides(swcOptions);
      }).toThrowError(SWCOverrideError);
    });
  });
});
