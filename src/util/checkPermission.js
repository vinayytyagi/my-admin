export function getPermissionValue(obj, path) {
  const a =
    path
      .split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
        obj
      ) === true;

  return a;
}
