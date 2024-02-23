import path from "path";
import { logger } from "./logger";
import { globSync } from "glob";
import resolvePackagePath from "resolve-package-path";
import semver from "semver";

export type ValidatePeerDepsConfig = {
  matchesToValidateDeps: string[];
  validateDepsTypes: "peerDependencies"[];
};

const CWD = process.cwd();

function findMatchesToValidateDeps(matchesToValidateDeps: string[]): string[] {
  return globSync(
    matchesToValidateDeps.map((el) => `**/${el}/package.json`),
    {
      cwd: CWD,
      absolute: true,
    },
  );
}

type ValidationError = {
  packageJsonPath: string;
  dependencyName: string;
  dependencyType: string;
  dependencyExpectation: string;
  dependencyActual: string | null;
  errorType: "mismatch" | "missed" | "other";
  meta?: unknown;
};

export function validatePeerDeps({
  matchesToValidateDeps = ["*"],
  validateDepsTypes = ["peerDependencies"],
}: ValidatePeerDepsConfig) {
  let errors: ValidationError[] = [];
  logger.debug("validatePeerDeps", {
    validateDepsTypes,
    matchesToValidateDeps,
  });

  const pkgFileNames = findMatchesToValidateDeps(matchesToValidateDeps);

  for (let pkgFileName of pkgFileNames) {
    const pkg = require(pkgFileName);
    const relativePkgFileName = path.relative(CWD, pkgFileName);

    for (let dependencyType of validateDepsTypes) {
      logger.log(`@${dependencyType} of ${pkgFileName}`);
      const deps = pkg[dependencyType];

      for (let dependencyName in deps) {
        try {
          const packageJsonPath = resolvePackagePath(
            dependencyName,
            pkgFileName,
          );

          if (!packageJsonPath) {
            errors.push({
              packageJsonPath: relativePkgFileName,
              dependencyName,
              dependencyType,
              dependencyExpectation: deps[dependencyName],
              dependencyActual: null,
              errorType: "missed",
            });
            continue;
          }

          const { version } = require(packageJsonPath);

          if (!semver.satisfies(version, deps[dependencyName])) {
            errors.push({
              packageJsonPath: relativePkgFileName,
              dependencyName,
              dependencyType,
              dependencyExpectation: deps[dependencyName],
              dependencyActual: version,
              errorType: "mismatch",
            });
            continue;
          }
        } catch (error) {
          errors.push({
            packageJsonPath: relativePkgFileName,
            dependencyName,
            dependencyType,
            dependencyExpectation: deps[dependencyName],
            dependencyActual: null,
            errorType: "other",
            meta: {
              error,
            },
          });
        }
      }
    }
  }
  if (errors.length) {
    logger.error(`There are ${errors.length} errors`);
    console.table(errors);
    process.exit(1);
  }
}
