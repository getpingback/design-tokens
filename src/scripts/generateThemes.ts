const fs = require("fs");
const tokens = require("../../tokens.json");

const _toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

const _writeExportContentFile = (newModesValues: any[]) => {
  return `
  ${newModesValues
    .map(
      (mode) =>
        `import ${_toCamelCase(mode.name)} from "./themes/${_toCamelCase(
          mode.name
        )}.json"\nimport ${_toCamelCase(
          mode.name
        )}Styles from "./themes/${_toCamelCase(mode.name)}.scss"`
    )
    .join("\n")}
    import themeStyles from "./themes/themes.scss"
    
    export {${newModesValues
      .map(
        (mode) => `${_toCamelCase(mode.name)}, ${_toCamelCase(mode.name)}Styles`
      )
      .join(",")}, themeStyles}
  `;
};

const _writeScssContentFile = (newModesValues: any[], variables: any) => {
  return `
  ${newModesValues
    .map((mode) => `@import "./${_toCamelCase(mode.name)}.scss";`)
    .join("\n")}

  ${variables}
  `;
};

const _writeScssVariablesFile = (obj: any, prefix = "") => {
  let scss = "";

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "object") {
      scss += _writeScssVariablesFile(value, `${prefix}${key}-`);
    } else {
      scss += `$${prefix}${key}: var(--${prefix}${key});\n`;
    }
  }

  return scss;
};

const _searchForReferences = (currentObj: any, referenceObj?: any) => {
  const objKeys = Object.keys(currentObj);

  objKeys.forEach((key) => {
    if (typeof currentObj[key] === "object") {
      _searchForReferences(currentObj[key], referenceObj);
    }

    if (typeof currentObj[key] === "string") {
      const value = _changeReferencesToValues(currentObj[key], referenceObj);
      currentObj[key] = _convertRGBAtoHex(value);
    }
  });
};

const _changeReferencesToValues = (str: string, obj: any) => {
  const regex = /{([^}]+)}/g;
  const matches = str.match(regex);

  if (!matches) return str;

  matches.forEach((match) => {
    const key = match.replace("{", "").replace("}", "");
    const splitKey = key.split(".");

    let colorValue = obj;
    splitKey.forEach((item) => {
      colorValue = colorValue[item];
    });

    if (colorValue) {
      str = str.replace(match, colorValue);
    }
  });

  return str;
};

const _convertRGBAtoHex = (rgbaString: string) => {
  const regex = /rgba\(([^,]+),([^)]+)\)/g;
  const rgbaValues = [...rgbaString.matchAll(regex)];

  if (!rgbaValues.length) return rgbaString;

  const hexColor = rgbaValues[0][1];
  const opacity = Math.round(parseFloat(rgbaValues[0][2]) * 255);
  const hexOpacity = opacity.toString(16).padStart(2, "0");

  return `${hexColor}${hexOpacity}`;
};

const _convertToScss = (obj: any, prefix = "", themeName = "") => {
  let scss = "";

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "object") {
      scss += _convertToScss(value, `${prefix}${key}-`);
    } else {
      scss += `--${prefix}${key}: ${value};\n`;
    }
  }

  if (themeName) return `.${themeName} {${scss}}`;
  return scss;
};

const _convertToJson = (mode: any) => {
  const currentTheme = {} as any;

  Object.keys(mode).forEach((firstKey) => {
    if (firstKey === "name") return;

    currentTheme[firstKey] = {};

    const firstKeyLevelObj = mode[firstKey];

    if (typeof firstKeyLevelObj.value === "string") {
      currentTheme[firstKey] = firstKeyLevelObj.value;
      return;
    }

    if (typeof firstKeyLevelObj === "object") {
      Object.keys(firstKeyLevelObj).forEach((secondKey) => {
        const secondKeyLevelObj = firstKeyLevelObj[secondKey];

        if (typeof secondKeyLevelObj?.value === "string") {
          currentTheme[firstKey][secondKey] = secondKeyLevelObj.value;
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

          currentTheme[firstKey][secondKey] = nestedValue;
          return;
        }

        if (
          secondKeyLevelObj?.value &&
          Object.keys(secondKeyLevelObj.value).length > 0
        ) {
          currentTheme[firstKey][secondKey] = secondKeyLevelObj.value;
          return;
        }

        if (
          !secondKeyLevelObj.value &&
          Object.keys(secondKeyLevelObj)?.length > 0
        ) {
          const colorObject = secondKeyLevelObj;
          currentTheme[firstKey][secondKey] = {};

          Object.keys(colorObject).forEach((thirdKey) => {
            currentTheme[firstKey][secondKey][thirdKey] =
              colorObject[thirdKey].value;
          });

          return;
        }
      });
    }
  });

  _searchForReferences(currentTheme, currentTheme);

  return currentTheme;
};

const themeModes = Object.keys(tokens).filter((key) => key.endsWith("Mode"));
const modesValues = themeModes.map((mode) => ({ ...tokens[mode], name: mode }));

modesValues.forEach((mode) => {
  const themeName = _toCamelCase(mode.name);
  const theme = _convertToJson(mode);
  const scssContent = _convertToScss(theme, "", themeName);

  fs.writeFileSync(`themes/${themeName}.scss`, scssContent);
  fs.writeFileSync(`themes/${themeName}.json`, JSON.stringify(theme));
});

fs.writeFileSync("index.ts", _writeExportContentFile(modesValues));

const pingbackLightMode = JSON.parse(
  fs.readFileSync("themes/pingbackLightMode.json", "utf8")
);

const scssVariables = _writeScssVariablesFile(pingbackLightMode);
fs.writeFileSync(
  "themes/themes.scss",
  _writeScssContentFile(modesValues, scssVariables)
);

console.log("Themes generated successfully");
