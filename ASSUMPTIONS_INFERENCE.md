## Assumptions and Inferences Made by `tswig`

`tswig` makes several assumptions and inferences when converting TypeScript compiler options to SWC configuration:

1. **Module Type Assumption:**
    - **Assumption:** If `esModuleInterop` is `true` in the TypeScript configuration and `module` is `ESNext`, the converter assumes that ECMAScript modules (`"module.type": "es6"`) should be used in SWC.
    - **Example:**
      ```typescript
      const tsconfig = {
        esModuleInterop: true,
        module: ts.ModuleKind.ESNext,
      };
      const swcConfig = SwcConfigBuilder.generateSwcConfig(tsconfig);
      console.log(swcConfig.module.type); // Output: "es6"
      ```

2. **JSX Assumption:**
    - **Assumption:** If `jsx` is `"react-jsx"` or `"react-jsxdev"` in the TypeScript configuration, the converter sets `jsxRuntime` to `"automatic"` in SWC.
    - **Example:**
      ```typescript
      const tsconfig = {
        jsx: ts.JsxEmit.ReactJSX,
      };
      const swcConfig = SwcConfigBuilder.generateSwcConfig(tsconfig);
      console.log(swcConfig.jsc.transform.runtime); // Output: "automatic"
      ```

3. **Class Names Assumption:**
    - **Assumption:** If `target` in the TypeScript configuration is not `"es3"`, `"es5"`, `"es6"`, or `"es2015"`, the converter assumes that class names should not be preserved in SWC (`"keepClassNames": false`).
    - **Example:**
      ```typescript
      const tsconfig = {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.CommonJS,
      };
      const swcConfig = SwcConfigBuilder.generateSwcConfig(tsconfig);
      console.log(swcConfig.jsc.keepClassNames); // Output: false
      ```

4. **Strict Mode Assumption:**
    - **Assumption:** If `alwaysStrict` is `true` or `noImplicitUseStrict` is `false` in the TypeScript configuration, the converter enables strict mode in SWC.
    - **Example:**
      ```typescript
      const tsconfig = {
        alwaysStrict: true,
      };
      const swcConfig = SwcConfigBuilder.generateSwcConfig(tsconfig);
      console.log(swcConfig.jsc.strictMode); // Output: true
      ```

5. **Allow JavaScript Files Assumption:**
    - **Assumption:** If `allowJs` is `true` in the TypeScript configuration, the converter assumes that JavaScript files should be allowed in SWC, and sets `jsc.parser.syntax` to `"ecmascript"` in the SWC configuration.
    - **Example:**
      ```typescript
      const tsconfig = {
        allowJs: true,
      };
      const swcConfig = SwcConfigBuilder.generateSwcConfig(tsconfig);
      console.log(swcConfig.jsc.parser.syntax); // Output: "ecmascript"
      ```

6. **Strict Null Checks Inference:**
    - **Inference:** If either `strict` or `strictNullChecks` is `true` in the TypeScript configuration, the converter assumes that strict null checks are enabled and sets the global optimizer variable `__NULLABLE_CHECK__` to `true` in the SWC configuration.
    - **Example:**
      ```typescript
      const tsconfig = {
        strict: true,
      };
      const swcConfig = SwcConfigBuilder.generateSwcConfig(tsconfig);
      console.log(swcConfig.jsc.transform.optimizer.globals.vars.__NULLABLE_CHECK__); // Output: true
      ```

7. **Synthetic Default Imports Assumption:**
    - **Assumption:** If `allowSyntheticDefaultImports` is `true` in the TypeScript configuration, and the module type is not `"systemjs"` and `module.noInterop` is not already `true`, the converter assumes that synthetic default imports are allowed and sets `module.noInterop` to `false` and `module.importInterop` to `"none"` in the SWC configuration.
    - **Example:**
      ```typescript
      const tsconfig = {
        allowSyntheticDefaultImports: true,
        module: ts.ModuleKind.ESNext,
        esModuleInterop: true,
      };
      const swcConfig = SwcConfigBuilder.generateSwcConfig(tsconfig);
      console.log(swcConfig.module.noInterop); // Output: false
      console.log(swcConfig.module.importInterop); // Output: "none"
      ```

8. **Target and Module Type Inference:**
    - **Inference:** The converter infers that the target and module type indicate an ECMAScript module (ESM) if the module type is equal to or greater than `ts.ModuleKind.ESNext` and the target is equal to or greater than `ts.ScriptTarget.ES2015`.
    - **Example:**
      ```typescript
      const moduleType = ts.ModuleKind.ESNext;
      const target = ts.ScriptTarget.ES2021;
      const isESM = SwcConfigBuilder.isESM(moduleType, target);
      console.log(isESM); // Output: true
      ```

9. **Multi-Package Repository Inference:**
    - **Inference:** If `outDir` is set and `rootDir` is not set in the TypeScript configuration, the converter infers that it is a multi-package repository configuration. This influences the `paths` and `baseUrl` options in the SWC configuration.
    - **Example:**
      ```typescript
      const tsconfig = {
        outDir: "dist",
      };
      const swcConfig = SwcConfigBuilder.generateSwcConfig(tsconfig);
      console.log(swcConfig.jsc.paths); // Output: {}
      console.log(swcConfig.jsc.baseUrl); // Output: "dist"
      ```

These are the assumptions and inferences made by `tswig` when converting TypeScript compiler options to SWC configuration.
