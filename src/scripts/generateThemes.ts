const fs = require("fs");
const tokens = require("../../tokens.json");

const _toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

const _writeIndexFile = (newModesValues: any[]) => {
  return `
  ${newModesValues
    .map(
      (mode) =>
        `import ${_toCamelCase(mode.name)} from "./themes/${_toCamelCase(
          mode.name
        )}.json"`
    )
    .join("\n")}
    
    export {${modesValues.map((mode) => _toCamelCase(mode.name)).join(",")}}
  `;
};

const modes = Object.keys(tokens).filter((key) => key.endsWith("Mode"));
const modesValues = modes.map((mode) => ({ ...tokens[mode], name: mode }));

modesValues.forEach((mode) => {
  const themeName = _toCamelCase(mode.name);

  fs.writeFile(
    `src/themes/${themeName}.json`,
    JSON.stringify(mode),
    (err: any) => {
      if (err) throw err;
      console.log(`${themeName}.json file created!`);
    }
  );
});

fs.writeFile(
  "src/index.ts",
  _writeIndexFile(modesValues),
  (err: any) => {
    if (err) throw err;
    console.log("index.ts file created!");
  }
);
