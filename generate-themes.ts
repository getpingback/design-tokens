import fs from "fs";
import path from "path";
import { toKebabCase, makeJsonTransformations } from "./src/utils";

const TOKENS_FOLDER_PATH = "./tokens";

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

        // TRANSFORMATIONS
        const transformedJson = makeJsonTransformations(json);

        // WRITING CONTENT FILES
        const colorFolderName = toKebabCase(colorFolder);
        const jsonFileName = toKebabCase(jsonFile);

        const colorDirPath = `themes/${colorFolderName}`;
        const colorFilePath = `${colorDirPath}/${jsonFileName}`;

        const isColorDirExists = fs.existsSync(colorDirPath);
        if (!isColorDirExists) fs.mkdirSync(colorDirPath, { recursive: true });

        fs.writeFileSync(colorFilePath, JSON.stringify(transformedJson));
      });
    }
  });
} else {
  console.error(`Directory ${TOKENS_FOLDER_PATH} does not exist.`);
}
