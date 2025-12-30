---
title: Fairspec TypeScript
sidebar:
  order: 1
  label: Getting Started
---

This guide will help you get started with Fairspec TypeScript. If you are new to the core framework's tecnhologies, please take a look at the [Fairspec standard](https://fairspec.org/) and [Polars DataFrames](https://pola.rs/) documentation.

## Runtimes

> [!TIP]
> - It is possible to use Fairspec TypeScript in [Jupyter Notebooks](/guides/jupyter)!

Fairspec TypeScript and all its packages support all the prominent TypeScript runtimes:

- **Node v22+**
- **Deno v2+**
- **Bun v1+**

The core package `@fairspec/metadata` additionally supports browser environments:

- **Edge v92+**
- **Chrome v92+**
- **Firefox v90+**
- and others

## Installation

> [!NOTE]
> The documentation uses `npm` command to install packages. If you are using other package managers, please adjust the commands accordingly.

The framework can be installed as one package:

```bash
npm install fairspect
```

You car cherry-pick from individual packages:

```bash
npm install @fairspec/metadata @fairspec/table
```

In the browser, the core package can be just imported using NPM CDNs:

```js
import { loadPackageDescriptor } from "https://esm.sh/@fairspec/metadata"
```

## TypeScript

> [!TIP]
> Use **Node v24+** to be able to run TypeScript files directly with the `node` binary like `node my-data-script.ts`

Fairspec TypeScript is built with type safety in mind. It uses TypeScript to provide type definitions for all packages and to enforce type safety throughout the framework. It's highly reccomended to setup a TypeScript aware environment to work with the project.

## Examples

Loading a Data Package from Zenodo merging system Zenodo metadata into a user data package and validating its metadata:

```ts
import { loadPackage } from "fairspec"

const { dataPackage } = await loadPackage("https://zenodo.org/records/10053903")

console.log(dataPackage)
//{
//  id: 'https://doi.org/10.5281/zenodo.10053903',
//  profile: 'tabular-data-package',
//  ...
//}

```

Validating an in-memory package descriptor:

```ts
import { validatePackageDescriptor } from "fairspec"

const { valid, errors } = await validatePackageDescriptor({ name: "package" })

console.log(valid)
// false
console.log(errors)
//[
//  {
//    instancePath: '',
//    schemaPath: '#/required',
//    keyword: 'required',
//    params: { missingProperty: 'resources' },
//    message: "must have required property 'resources'",
//    type: 'descriptor'
//  }
//]
```

Loading a package from a remote descriptor and saving it locally as a zip archive, and then using it as a local data package:

```ts
import {
  loadPackageDescriptor,
  loadPackageFromZip,
  savePackageToZip,
  getTempFilePath,
} from "fairspec"

const archivePath = getTempFilePath()
const sourcePath = await loadPackageDescriptor(
  "https://raw.githubusercontent.com/roll/currency-codes/refs/heads/master/datapackage.json",
)

await savePackageToZip(sourcePackage, { archivePath })
const targetPackage = await loadPackageFromZip(archivePath)
console.log(targetPackage)
```

Reading a CSV table:

```ts
import { loadTable } from "fairspec"

const table = await loadTable({ path: "data.csv" })

// Load with custom dialect
const table = await loadTable({
  path: "data.csv",
  dialect: {
    delimiter: ";",
    header: true,
    skipInitialSpace: true
  }
})
```

## Reference

See **API Reference** of each individual package for more details. Note, that `fairspec` package re-export most of the functionality.
