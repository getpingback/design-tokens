import { makeJsonTransformations } from "./jsonTransformation";

export const toKebabCase = (str: string) => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

export { makeJsonTransformations };
