export type ValidatePeerDepsConfig = {
  matches: string[];
};
export function validatePeerDeps(params: ValidatePeerDepsConfig) {
  console.log("Hola", params);
}
