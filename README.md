# validate-deps: Validate peer dependencies for your packages.

[![npm version](https://badge.fury.io/js/validate-deps.svg)](https://www.npmjs.com/package/validate-deps)

The problem: some package managers just warn you if peerDependencies are not met. The package is aimed to cover this moment in CI

### How to use

```
# To get help
npx validate-deps --help

# Typical usage to validate scope packages
npx validate-deps --matchesToValidateDeps "@my-scope/*"
```
