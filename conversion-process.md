# Design Token Transformation Process

## Introduction

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. Our design tokens originate from Token Studio, a Figma plugin used by the Pingback Design Team. The team has crafted 20 color themes, available in the ./tokens directory, organized by theme name with corresponding Dark Mode.json and Light Mode.json files for each.

```
tokens/
├── Black/
│   ├── Dark Mode.json
│   └── Light Mode.json
├── Blue/
│   ├── Dark Mode.json
│   └── Light Mode.json
├── Bronze/
│   ├── Dark Mode.json
│   └── Light Mode.json
...
```

---

## Transformations in the Original JSON

To utilize these tokens within our applications, we perform a series of transformations on the original JSON files from Token Studio.

All the transformations are made in the `makeJsonTransformations` function.

### Removal of `type` and `description` Properties

Our applications do not require the `type` and `description` properties present in the original tokens.

The `cleanJson` function streamlines the JSON structure by removing these properties and promoting the `value` property to be more accessible.

### Reference Resolution

The original JSON may contain references to other values within the theme object itself. For instance:

```JSON
"color": {
  "value": "{palette.gray.900}",
  "type": "color"
},
```

The `changeReferences` function resolves these string references to their actual values, enabling direct use in our applications:

```JSON
"color": "#1A1A1A"
```

### Convert RGBA to HEX

Colors in the JSON are provided in RGBA format. The `convertRGBAtoHex` function converts these colors to HEX format, which is more suitable for our applications.

---

## Generation of CSS Variables Files

The `generateCSSTheme` function generates CSS files from the transformed JSON files. The CSS files are generated in the following format:

```CSS
.purple-classic-light-mode {
  --palette-gradiente-1: linear-gradient(106.01deg, #9061F9 33.8%, #BF61F9 102.3%);
  --palette-gradiente-2: linear-gradient(71.21deg, #F2ECFF 0%, #8F59FF 56.51%, #793CF9 76.6%, #854AFF 108.78%, #D3A7FA 133.88%);
  --palette-gradiente-3: linear-gradient(202.2deg, #9061F9 -49.7%, #3F3F46 64.6%);
}
```

```CSS
.purple-classic-dark-mode {
  --palette-gradiente-1: linear-gradient(106.01deg, #9061F9 33.8%, #BF61F9 102.3%);
  --palette-gradiente-2: linear-gradient(71.21deg, #F2ECFF 0%, #8F59FF 56.51%, #793CF9 76.6%, #854AFF 108.78%, #D3A7FA 133.88%);
  --palette-gradiente-3: linear-gradient(202.2deg, #9061F9 -49.7%, #3F3F46 64.6%);
}
```

---

## Generation of main.css File

The `appendThemeToMainCss` function generates a `main.css` file that contains all the CSS variables for all the themes. This file is used to provide the CSS variables to the application.

```CSS
@import url("./black/dark-mode.css");

@import url("./black/light-mode.css");

@import url("./blue/dark-mode.css");

@import url("./blue/light-mode.css");

@import url("./bronze/dark-mode.css");

@import url("./bronze/light-mode.css");

...
```

---

## Generation of New Files in the `./themes` Directory

Post-transformation, new JSON and CSS files representing the themes are written to the `./themes` directory. The directory structure is as follows:

```
themes/
├── black/
│   ├── dark-mode.json
│   ├── light-mode.json
│   ├── dark-theme.css
│   └──── light-theme.css
├── blue/
│   ├── dark-mode.json
│   ├── light-mode.json
│   ├── dark-theme.css
│   └── light-theme.css
...
```

Each theme folder contains the transformed JSON files and the generated CSS files, which are the ready-to-use outputs of the transformation process.
