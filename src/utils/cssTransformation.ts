import fs from "fs";
import path from "path";

export const generateCSSTheme = (obj: any, prefix = "", themeName = "") => {
  let scss = "";

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "object") {
      scss += generateCSSTheme(value, `${prefix}${key}-`);
    } else {
      scss += `--${prefix}${key}: ${value};\n`;
    }
  }

  if (themeName) return `.${themeName} {${scss}}`;
  return scss;
};

export const appendThemeToMainCss = (color: string, theme: string) => {
  const mainCssPath = path.join(__dirname, "../../themes/main.css");
  const mainCss = fs.readFileSync(mainCssPath, "utf-8");

  const content = `@import url("./${color}/${theme}");`;
  const newMainCss = `${mainCss}\n\n${content}`;

  fs.writeFileSync(mainCssPath, newMainCss);
};
