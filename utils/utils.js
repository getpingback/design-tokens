export const removeCompoundTypography = (node) => {
  if (node && typeof node === 'object') {
    if (!Array.isArray(node) && node.$type === 'typography') {
      return undefined;
    }

    if (Array.isArray(node)) {
      const prunedArray = node
        .map((child) => removeCompoundTypography(child))
        .filter((child) => child !== undefined);
      return prunedArray;
    }

    const result = {};
    for (const [key, value] of Object.entries(node)) {
      const prunedValue = removeCompoundTypography(value);
      if (prunedValue !== undefined) {
        result[key] = prunedValue;
      }
    }

    if (Object.keys(result).length === 0) {
      return undefined;
    }
    return result;
  }
  return node;
};
