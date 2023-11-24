import { ThemeConfig } from "../types/tokens-studio";

/**
 * Processes a string that contains placeholder references (e.g., {color.primary})
 * and replaces them with actual values from a JSON object.
 *
 * @param str The string containing placeholder references to be replaced.
 * @param jsonData The JSON object containing the actual values to replace the placeholders with.
 * @returns The processed string with all placeholder references replaced with actual values from the JSON object.
 */
export const applyReferenceValue = (str: string, jsonData: any) => {
  str = str.replace(";", "");
  const regex = /{([^}]+)}/g;
  const matches = str.match(regex);

  if (!matches) return str;

  matches.forEach((match) => {
    const key = match.replace("{", "").replace("}", "");
    const splitKey = key.split(".");

    let colorValue = jsonData;
    splitKey.forEach((item) => {
      colorValue = colorValue[item];
    });

    if (colorValue) str = str.replace(match, colorValue);
  });

  return str;
};

/**
 * Converts RGBA color strings to their equivalent hexadecimal representation.
 *
 * @param rgbaString The RGBA color string to be converted.
 * @returns The hexadecimal representation of the RGBA color, including the alpha transparency value.
 */
export const convertRGBAtoHex = (rgbaString: string) => {
  const regex = /rgba\(([^,]+),([^)]+)\)/g;
  const rgbaValues = [...rgbaString.matchAll(regex)];

  if (!rgbaValues.length) return rgbaString;

  const hexColor = rgbaValues[0][1];
  const opacity = Math.round(parseFloat(rgbaValues[0][2]) * 255);
  const hexOpacity = opacity.toString(16).padStart(2, "0");
  const combinedHex = `${hexColor}${hexOpacity}`;

  const color = rgbaString.replace(regex, combinedHex);

  return color;
};

/**
 * Recursively applies reference values to string properties of an object based
 * on a reference object and converts RGBA colors to hexadecimal format.
 *
 * @param currentObj The object to process. Its string properties may contain reference keys to be replaced with actual values.
 * @param referenceObj The reference object providing the values for the references.
 * @returns The processed object with all reference values applied and RGBA colors converted to hexadecimal format.
 */
export const changeReferences = (currentObj: any, referenceObj: ThemeConfig) => {
  const objKeys = Object.keys(currentObj);

  objKeys.forEach((key) => {
    if (typeof currentObj[key] === "object") {
      changeReferences(currentObj[key], referenceObj);
    }

    if (typeof currentObj[key] === "string") {
      const value = applyReferenceValue(currentObj[key], referenceObj);
      currentObj[key] = convertRGBAtoHex(value);
    }
  });

  return currentObj;
};

/**
 * Cleans a JSON object by removing unused properties and
 * setting the value of the property to the value of the value key.
 *
 * @param jsonData The JSON object to clean.
 * @returns A new JSON object with unused properties removed and values directly assigned.
 */
export const cleanJson = (jsonData: any) => {
  const newJsonData = {} as any;

  Object.keys(jsonData).forEach((firstKey) => {
    newJsonData[firstKey] = {};

    const firstKeyLevelObj = jsonData[firstKey];

    if (typeof firstKeyLevelObj.value === "string") {
      newJsonData[firstKey] = firstKeyLevelObj.value;
      return;
    }

    if (typeof firstKeyLevelObj === "object") {
      Object.keys(firstKeyLevelObj).forEach((secondKey) => {
        const secondKeyLevelObj = firstKeyLevelObj[secondKey];

        if (typeof secondKeyLevelObj?.value === "string") {
          newJsonData[firstKey][secondKey] = secondKeyLevelObj.value;
          return;
        }

        if (secondKeyLevelObj?.value?.length > 0) {
          const arrayOfValuesObject = secondKeyLevelObj.value;
          let nestedValue = "";

          arrayOfValuesObject.forEach((valueObject: any, index: number) => {
            const color = arrayOfValuesObject[index].color;
            delete valueObject.type;
            delete valueObject.color;

            Object.values(valueObject).forEach((value: any) => {
              nestedValue += `${value}px `;
            });

            nestedValue += `${color}${
              index === arrayOfValuesObject.length - 1 ? "" : ", "
            }`;
          });

          newJsonData[firstKey][secondKey] = nestedValue;
          return;
        }

        if (
          secondKeyLevelObj?.value &&
          Object.keys(secondKeyLevelObj.value).length > 0
        ) {
          newJsonData[firstKey][secondKey] = secondKeyLevelObj.value;
          return;
        }

        if (
          !secondKeyLevelObj.value &&
          Object.keys(secondKeyLevelObj)?.length > 0
        ) {
          const colorObject = secondKeyLevelObj;
          newJsonData[firstKey][secondKey] = {};

          Object.keys(colorObject).forEach((thirdKey) => {
            newJsonData[firstKey][secondKey][thirdKey] =
              colorObject[thirdKey].value;
          });

          return;
        }
      });
    }
  });

  return newJsonData;
};

/**
 * Applies a series of transformations to a JSON object, including
 * cleaning the JSON and changing references within it.
 *
 * @param jsonData The JSON object to transform.
 * @returns The transformed JSON object after cleaning and reference changes.
 */
export const makeJsonTransformations = (jsonData: ThemeConfig) => {
  const removedUnusedProperties = cleanJson(jsonData);
  const changedReferences = changeReferences(
    removedUnusedProperties,
    removedUnusedProperties
  );

  return changedReferences;
};
