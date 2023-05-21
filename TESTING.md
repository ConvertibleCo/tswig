# `tswig` Testing Strategy

At Convertible, we believe in the importance of providing robust support for developers and engineers to build applications using the tools they love. To ensure we adhere to this tenet in `tswig`, we've implemented a comprehensive testing strategy that covers multiple Node.js LTS versions and TypeScript versions.

## Why This Matters to You

As developers, the tools you choose need to work reliably in your environment. `tswig` converts `tsconfig` to `swc` config, and since it has a peer dependency on TypeScript, we ensure that our package works seamlessly across a wide range of TypeScript versions. This means you can trust `tswig` to work correctly with your TypeScript setup, irrespective of the specific TypeScript version you're using.

## Testing Across Node.js LTS Versions

We test `tswig` against all Long-Term Support (LTS) versions of Node.js. This ensures that whether you're sticking with an older, stable version of Node.js for its proven reliability, or using the latest LTS version, `tswig` is confirmed to work in your environment.

## Testing Across TypeScript Versions

We test `tswig` against the latest minor version of each TypeScript version since 3.0. Specifically, we cover the following TypeScript versions:

- 3.0.3
- 3.1.8
- 3.2.4
- 3.3.3
- 3.4.5
- 3.5.3
- 3.6.5
- 3.7.7
- 3.8.3
- 3.9.10
- 4.0.8
- 4.1.6
- 4.2.4
- 4.3.5
- 4.4.4
- 4.5.5
- 4.6.4
- 4.7.4
- 4.8.4
- 4.9.5
- 5.0.4

This ensures that as TypeScript evolves and new versions are released, `tswig` continues to provide reliable support for your projects.

## Further Resources

We remain committed to ensuring that `tswig` is compatible with the latest stable releases of TypeScript and Node.js. To stay updated with the latest versions of these technologies, you can visit the following pages:

- [TypeScript on GitHub](https://github.com/microsoft/TypeScript/releases): Check out the latest stable releases of TypeScript.
- [Node.js Downloads](https://nodejs.org/en/download/): See the latest LTS and current versions of Node.js.

Our testing strategy is our commitment to you. By providing comprehensive coverage across different Node.js LTS versions and TypeScript versions, we ensure that `tswig` remains a reliable and trustworthy tool in your development workflow.
