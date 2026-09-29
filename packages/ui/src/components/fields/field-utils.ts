export function mergeDescribedBy(...values: readonly (string | undefined)[]): string | undefined {
  const ids = new Set<string>();
  for (const value of values) {
    for (const id of value?.trim().split(/\s+/) ?? []) {
      if (id) ids.add(id);
    }
  }
  return ids.size > 0 ? [...ids].join(" ") : undefined;
}
