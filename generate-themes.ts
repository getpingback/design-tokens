import fs from "fs";
import path from "path";
import {
  toKebabCase,
  makeJsonTransformations,
  generateCSSTheme,
  appendThemeToMainCss,
} from "./src/utils";

const TOKENS_FOLDER_PATH = "./tokens";

fs.writeFileSync("./themes/main.css", "");

if (fs.existsSync(TOKENS_FOLDER_PATH)) {
  const colorFolders = fs.readdirSync(TOKENS_FOLDER_PATH);

  colorFolders.forEach((colorFolder) => {
    const colorFolderPath = path.join(TOKENS_FOLDER_PATH, colorFolder);

    if (fs.statSync(colorFolderPath).isDirectory()) {
      const files = fs.readdirSync(colorFolderPath);

      const jsonFiles = files.filter((file) => path.extname(file) === ".json");

      jsonFiles.forEach((jsonFile) => {
        const jsonFilePath = path.join(colorFolderPath, jsonFile);
        const jsonStr = fs.readFileSync(jsonFilePath, "utf-8");
        const json = JSON.parse(jsonStr);

        // FILE NAMES
        const colorFolderName = toKebabCase(colorFolder);
        const jsonFileName = toKebabCase(jsonFile);
        const cssFileName = toKebabCase(jsonFile).replace(".json", ".css");

        // JSON TRANSFORMATIONS
        const transformedJson = makeJsonTransformations(json);
        const transformedJsonStr = JSON.stringify(transformedJson);

        // CSS THEME GENERATION
        const cssThemeClassName = `${colorFolderName}-${jsonFileName.replace(
          ".json",
          ""
        )}`;
        const cssThemeVars = generateCSSTheme(transformedJson, "", cssThemeClassName);

        // PATHS
        const colorDirPath = `themes/${colorFolderName}`;
        const colorThemeJsonFilePath = `${colorDirPath}/${jsonFileName}`;
        const colorThemeCssFilePath = `${colorDirPath}/${cssFileName}`;

        // CREATE DIRS AND FILES
        const isColorDirExists = fs.existsSync(colorDirPath);
        if (!isColorDirExists) fs.mkdirSync(colorDirPath, { recursive: true });

        fs.writeFileSync(colorThemeJsonFilePath, transformedJsonStr);
        fs.writeFileSync(colorThemeCssFilePath, cssThemeVars);
        appendThemeToMainCss(colorFolderName, cssFileName);
      });
    }
  });
} else {
  console.error(`Directory ${TOKENS_FOLDER_PATH} does not exist.`);
}
