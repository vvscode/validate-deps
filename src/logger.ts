import { Signale } from "signale";
import pkg from "../package.json";

export const logger = new Signale({
  logLevel: process.env.VALIDATE_PEERDEPS_LOG_LEVEL || "error",
  scope: pkg.name,
  interactive: true,
});
