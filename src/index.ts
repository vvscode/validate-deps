#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import pkg from "../package.json";
import { type ValidatePeerDepsConfig, validatePeerDeps } from "./validate";

yargs(hideBin(process.argv))
  .command<ValidatePeerDepsConfig>({
    command: "$0",
    describe: "Check peer dependencies",
    builder: {
      matches: {
        describe: "Match (wildcard)",
        array: true,
        type: "string",
        default: [],
      },
    },
    handler: validatePeerDeps,
  })
  .version(pkg.version)
  .parse();
