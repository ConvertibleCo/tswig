# `tswig` - TypeScript to SwcConfigBuilder Config Converter
[![npm version](https://badge.fury.io/js/swc-config-converter.svg)](https://badge.fury.io/js/swc-config-converter)
[![Build Status](https://travis-ci.com/swc-project/swc-config-converter.svg?branch=master)](https://travis-ci.com/swc-project/swc-config-converter)
[![Coverage Status](https://coveralls.io/repos/github/swc-project/swc-config-converter/badge.svg?branch=master)](https://coveralls.io/github/swc-project/swc-config-converter?branch=master)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

`tswig` is a powerful utility that translates TypeScript configuration files (`tsconfig.json`) to SwcConfigBuilder configuration files. It enables users to transition from TypeScript to SwcConfigBuilder while maintaining as much of their original setup as possible, reducing the time and complexity involved in manual conversion. It only has one dependency... typescript >=3.

## Why Use `tswig`?

SwcConfigBuilder is a super-fast JavaScript/TypeScript compiler written in Rust. It's a great alternative to TypeScript, especially for large projects. However, SwcConfigBuilder's configuration is different from TypeScript's, and manually converting your TSConfig to SwcConfigBuilder's configuration can be a tedious and error-prone process. `tswig` automates this process, allowing you to focus on your code instead of your configuration. It also provides a convenient way to transition from TypeScript to SwcConfigBuilder, and to experiment with SwcConfigBuilder without having to change your existing configuration.

## Features

`tswig` is designed to be a faithful and flexible TSConfig translator, providing the following features:

1. **1:1 Conversion:** 
Converts most fields from the TSConfig to the equivalent in SwcConfigBuilder. This includes various compiler options such as `target`, `module`, `jsxFactory`, `jsxFragmentFactory`, `jsxImportSource`, and more.

2. **Intelligent Assumptions:**
For options that don't have a direct equivalent in SwcConfigBuilder, the converter makes intelligent assumptions based on related TSConfig options and SwcConfigBuilder's features. For example, the converter infers the `module.type` SwcConfigBuilder option based on TSConfig's `module` and `esModuleInterop` options. If `esModuleInterop` is true and module is `ESNext`, it assumes the user wants to use ECMAScript modules, and sets `module.type` to 'es6'.

3. **SwcConfigBuilder-Specific Options:**
In addition to converting TSConfig options, users can provide additional SwcConfigBuilder-specific options via the swcOptions parameter. These options will be merged with the converted TSConfig options to form the final SwcConfigBuilder configuration.

4. **Project References Support:**
If your TypeScript configuration uses project references, the converter can generate separate SwcConfigBuilder configurations for each referenced project. This is achieved through the generateConfigs method.

5. **Verbose Mode:**
For detailed insight into the conversion process, a verbose mode is available that provides comprehensive logging.

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

### Conversion
```javascript
// swc.config.js
const tswig = require('@convertible/tswig');

const pathToTsconfig = './tsconfig.json';

const swcOptions = {
    // Any additional SwcConfigBuilder-specific options
};

process.env.TSWIG_VERBOSE = true; // Set to true for verbose logging

const swcConfig = tswig.convert(pathToTsconfig, swcOptions);

export default swcConfig;
----

// alternatively you can pass a parsed tsconfig object
const tsconfig = {
    // your tsconfig object
}

const swcConfig = tswig.convert(tsconfig, swcOptions);
```
### Generating Configs for Project References
The generateConfigs method returns an object where each key is a project reference path and its value is the corresponding SwcConfigBuilder configuration.

```javascript
const configs = SwcConfigBuilder.generateConfigs(tsconfig, swcOptions, verbose);

for (const [path, config] of Object.entries(configs)) {
    console.log(`SwcConfigBuilder config for ${path}:`, config);
    // you can write the config to a file, or use it in any other way
    // e.g. fs.writeFileSync(`${path}/swc.config.json`, JSON.stringify(config, null, "\t"));
}
```

## Assumptions and Inference
`tswig` is designed to produce a SwcConfigBuilder configuration that's as close as possible to the provided TSConfig. However, not all TSConfig options have direct equivalents in SwcConfigBuilder. In these cases, the converter uses related TSConfig options and SwcConfigBuilder's features to make intelligent assumptions.

Here are a few examples:

- **Module Type:** If esModuleInterop is true in TSConfig, and module is ESNext, the converter assumes the user wants to use ECMAScript modules in SwcConfigBuilder, and sets module.type to 'es6'.

- **JSX:** If jsx is react-jsx or react-jsxdev in TSConfig, the converter sets jsxRuntime to 'automatic' in SwcConfigBuilder.

- **Class Names:** If target is 'es3', 'es5', 'es6', or 'es2015' in TSConfig, the converter sets keepClassNames to false in SwcConfigBuilder.

- **Strict Mode:** If alwaysStrict is true or noImplicitUseStrict is false in TSConfig, the converter enables strict mode in SwcConfigBuilder.

### Environment-Specific Configurations
We make no assumptions about your runtime environment. If you want to have environment-specific configurations, handle them outside of this conversion utility, and pass them as part of the `swcOptions` instead. This way, the conversion remains deterministic and easier to test, and you maintain ultimate control over the configuration.

## Feedback and Contributions
We strive to make `tswig` as accurate and helpful as possible. However, due to the differences between TypeScript and SwcConfigBuilder, there may be edge cases where the converter's assumptions don't match the user's intentions. If you encounter such cases, we encourage you to provide feedback and contribute to the project.

You can use the swcOptions parameter to provide additional SwcConfigBuilder-specific options and override any settings from the TSConfig conversion. This gives you the ultimate control over your SwcConfigBuilder configuration.

## Future Enhancements

We're continually improving `tswig` and exploring more ways to infer SwcConfigBuilder options from TSConfig settings. We welcome your ideas and contributions!

-----------------

Please note that `tswig` is designed to facilitate your transition from TypeScript to SwcConfigBuilder. It doesn't guarantee a perfect 1:1 mapping due to the inherent differences between the two compilers. Always review and test the generated SwcConfigBuilder configurations thoroughly before using them in your projects.