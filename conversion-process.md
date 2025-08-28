# Design Tokens with Style Dictionary

## Overview

Tokens are generated with Style Dictionary from a single `tokens.json` exported by Token Studio (Figma). This file contains:

- **Tokens**: the base/palette of values (colors, spacing, typography, etc.).
- **Light Mode** and **Dark Mode**: usage aliases that reference the base via `{references}`.

Simplified example of the Token Studio format:

```json
{
  "Tokens": {
    "neutral": {
      "black": { "$type": "color", "$value": "#000000" },
      "white": { "$type": "color", "$value": "#ffffff" }
    }
  },
  "Light Mode": {
    "background": {
      "default": { "$type": "color", "$value": "{brown.50}" },
      "inverse": { "$type": "color", "$value": "{gray.900}" }
    }
  },
  "Dark Mode": {
    "background": {
      "default": { "$type": "color", "$value": "{gray.900}" },
      "inverse": { "$type": "color", "$value": "{brown.50}" }
    }
  }
}
```

## Build with Style Dictionary

Tools used:

- `style-dictionary@5`
- `@tokens-studio/sd-transforms`

Key points from the current configuration (`config.js`):

- Two parsers filter the mode before building:
  - `light-parser` removes the `Dark Mode` key.
  - `dark-parser` removes the `Light Mode` key.
- For CSS we use `transformGroup: tokens-studio` and `name/kebab` (generates `--tokens-in-kebab-case`).
- For JS we use `transformGroup: tokens-studio` and `name/constant` (generates `CONSTANT_CASE`).
- For Dark, `outputReferences: true` is enabled to keep variable references (for example, `var(--gray-900)`), aiding overrides and consistency.

Build script (package.json):

```bash
yarn build
```

## Generated output

- CSS
  - `dist/css/light.css`: defines variables on `:root` (resolved values, e.g., hex/px).
  - `dist/css/dark.css`: defines variables on `.dark` (many as `var(...)` referencing the base palette).
- JS (ESM)
  - `dist/js/light.js`
  - `dist/js/dark.js`

Example (real snippets):

```12:18:dist/css/light.css
:root {
  --background-default: #fdfcfc;
  --background-inverse: #19191a;
  // ... more variables
}
```

```5:11:dist/css/dark.css
.dark {
  --background-default: var(--gray-900);
  --background-inverse: var(--brown-50);
  // ... more variables
}
```

## How to use

### CSS

1. Import the stylesheets:

```css
@import url('@getpingback/design-tokens/dist/css/light.css');
@import url('@getpingback/design-tokens/dist/css/dark.css');
```

2. Apply the `dark` class on the root container when you want Dark Mode:

```html
<html class="dark">
  ...
</html>
```

3. Consume the variables in your components:

```css
background: var(--background-default);
color: var(--text-default-primary);
```

### JS (when you need values at runtime)

```js
import { BACKGROUND_DEFAULT } from '@getpingback/design-tokens/dist/js/light';
// or
import { BACKGROUND_DEFAULT as DARK_BACKGROUND_DEFAULT } from '@getpingback/design-tokens/dist/js/dark';
```

## Update flow

1. Update `tokens.json` exported from Token Studio (keep the structure: `Tokens`, `Light Mode`, `Dark Mode`).
2. Run `yarn build` to generate `dist/css/*.css` and `dist/js/*.js`.

## Decisions and conventions

- **Naming**: CSS in kebab-case (`--background-default`), JS in CONSTANT_CASE (`BACKGROUND_DEFAULT`).
- **Light vs Dark**: Light resolves values; Dark keeps references where possible to reflect the base palette.
- **Single theme with modes**: We no longer generate multiple theme folders nor `main.css`. Consumption is via global variables and mode switching via `.dark`.
