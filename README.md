# `tswig` - TypeScript to SWC Config Converter

[//]: # ([![npm version]&#40;https://badge.fury.io/js/swc-config-converter.svg&#41;]&#40;https://badge.fury.io/js/swc-config-converter&#41;)

[//]: # ([![Build Status]&#40;https://travis-ci.com/swc-project/swc-config-converter.svg?branch=master&#41;]&#40;https://travis-ci.com/swc-project/swc-config-converter&#41;)
[![Coverage Status](https://img.shields.io/codecov/c/github/ConvertibleCo/tswig)](https://img.shields.io/codecov/c/github/ConvertibleCo/tswig)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

`tswig` is a powerful utility that translates TypeScript configuration files (`tsconfig.json`) to SWC configuration files. It enables users to transition from TypeScript to SWC while maintaining as much of their original setup as possible, reducing the time and complexity involved in manual conversion. It only has one dependency... typescript >=3.

## Why Use `tswig`?

[SWC]("https://github.com/swc-project/swc") is a super-fast JavaScript/TypeScript compiler written in Rust. It's a great alternative to TypeScript, especially for large projects. However, SWC's configuration is different from TypeScript's, and manually converting your tsconfig to SWC's configuration can be a tedious and error-prone process. `tswig` automates this process, allowing you to focus on your code instead of your configuration. It also provides a convenient way to transition from TypeScript to SWC, and to experiment with SWC without having to change your existing configuration.

## Features

`tswig` is designed to be a faithful and flexible TSConfig translator, providing the following features:

1. **1:1 Conversion:** 
Converts most fields from the TSConfig to the equivalent in SWC. This includes various compiler options such as `target`, `module`, `jsxFactory`, `jsxFragmentFactory`, `jsxImportSource`, and more.

2. **Intelligent Assumptions:**
For options that don't have a direct equivalent in SWC, the converter makes intelligent assumptions based on related TSConfig options and SWC's features. For example, the converter infers the `module.type` SWC option based on TSConfig's `module` and `esModuleInterop` options. If `esModuleInterop` is true and module is `ESNext`, it assumes the user wants to use ECMAScript modules, and sets `module.type` to 'es6'.

3. **SWC-Specific Options:**
In addition to converting TSConfig options, users can provide additional SWC-specific options via the swcOptions parameter. These options will be merged with the converted TSConfig options to form the final SWC configuration.

4. **Project References Support:**
If your TypeScript configuration uses project references, the converter can generate separate SWC configurations for each referenced project. This is achieved through the generateConfigs method.

5. **Verbose Mode:**
For detailed insight into the conversion process, a verbose mode is available that provides comprehensive logging.

6. **Lean and Secure Conversion:**
Our converter operates without introducing additional dependencies. By utilizing your existing TypeScript setup, we prioritize a streamlined process that enhances security by minimizing potential risks in your build.

## Installation

```bash
npm install @convertible/tswig --save-dev
```
```bash
yarn add @convertible/tswig --dev
```
```bash
pnpm add @convertible/tswig --save-dev
```

## Usage

`tswig` is seriously simple.

```javascript
// swc.config.js
const tswig = require('@convertible/tswig');

const config = tswig.Convert();

console.log(config.toString());
// Output: a JSON string of the SWC configuration!
```

`tswig` is also seriously flexible.

```javascript
// swc.config.js
const tswig = require('@convertible/tswig');

const config = tswig.Convert({
    tsconfig: './tsconfig.json',
    swcOptions: {
        jsc: {
            parser: {
                syntax: 'typescript',
                tsx: true,
                dynamicImport: true,
                decorators: true,
                privateMethod: true,
                classPrivateProperty: true,
                exportDefaultFrom: true,
                exportNamespaceFrom: true,
                nullishCoalescing: true,
                optionalChaining: true,
            },
            transform: {
                react: {
                    runtime: 'automatic',
                    pragma: 'React.createElement',
                    pragmaFrag: 'React.Fragment',
                    throwIfNamespace: true,
                    development: false,
                    useBuiltins: false,
                },
            },
        },
    },
});

console.log(config.toString());
// Output: a JSON string of the SWC configuration!
```

## Examples

To see complete examples of `tswig` in action, check out the [examples](./examples) folder. These are the same projects we use to run our e2e tests.

```
examples/
    ├── ts-3/
    ├── ts-4/
    ├── ts-5/
    ├── monorepo/ // comming soon
    ├── project-references/ // comming soon
    ├── bazel/ // comming soon
    └── complex-overrides/
```

## Assumptions and Inference
`tswig` is designed to produce a SWC configuration that's as close as possible to the provided TSConfig. However, not all TSConfig options have direct equivalents in SWC. In these cases, the converter uses related TSConfig options and SWC's features to make intelligent assumptions. You can see the complete assumption list with examples in the [assumptions design](./ASSUMPTIONS_INFERENCE.md) file.

Here are a few examples:

- **Module Type:** If esModuleInterop is true in TSConfig, and module is ESNext, the converter assumes the user wants to use ECMAScript modules in SWC, and sets module.type to 'es6'.

- **JSX:** If jsx is react-jsx or react-jsxdev in TSConfig, the converter sets jsxRuntime to 'automatic' in SWC.

- **Class Names:** If target is 'es3', 'es5', 'es6', or 'es2015' in TSConfig, the converter sets keepClassNames to false in SWC.

- **Strict Mode:** If alwaysStrict is true or noImplicitUseStrict is false in TSConfig, the converter enables strict mode in SWC.

### Environment-Specific Configurations
We make no assumptions about your runtime environment. If you want to have environment-specific configurations, handle them outside of this conversion utility, and pass them as part of the `swcOptions` instead. This way, the conversion remains deterministic and easier to test, and you maintain ultimate control over the configuration.

## Feedback and Contributions
We strive to make `tswig` as accurate and helpful as possible. However, due to the differences between TypeScript and SWC, there may be edge cases where the converter's assumptions don't match the user's intentions. If you encounter such cases, we encourage you to provide feedback and contribute to the project.

You can use the swcOptions parameter to provide additional SWC-specific options and override any settings from the TSConfig conversion. This gives you the ultimate control over your SWC configuration.

### Want to contribute?
If you want to contribute to the project, please read the [contributing guidelines](./CONTRIBUTING.md).

## Future Enhancements

We're continually improving `tswig` and exploring more ways to infer SWC options from TSConfig settings. We welcome your ideas and contributions!

-----------------

Please note that `tswig` is designed to facilitate your transition from TypeScript to SWC. It doesn't guarantee a perfect 1:1 mapping due to the inherent differences between the two compilers. Always review and test the generated SWC configurations thoroughly before using them in your projects.
