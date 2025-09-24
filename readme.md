![Stash Icons Cover](https://res.cloudinary.com/pingback/image/upload/v1684178797/stash-assets/Templates_oum6vi.png)

<div align="center"><strong>@getpingback/design-tokens</strong></div>
<div align="center">CSS variables and JS constants generated from Token Studio via Style Dictionary.</div>
<br />
<div align="center">
<a href="https://www.notion.so/pingback/Design-Tokens-f4787d6c2b9145a48bb9a6cc33204014?pvs=4">Notion</a> 
<span> · </span>
<a href="https://www.figma.com/file/TqTBEmVDZcgmdq2AmCvl5l/%5BPb%5D-Design-System-V1.0?type=design&node-id=531%3A1353&t=5XtKoK2mSOGxCwgP-1">Figma</a>
</div>

## Install

#### With yarn

```sh
yarn add @getpingback/design-tokens
```

#### With npm

```sh
npm install @getpingback/design-tokens
```

## Getting started

Use the generated CSS variables (Light on :root, Dark under the .dark selector) or import JS constants when you need values at runtime.

### CSS usage

```css
@import url('@getpingback/design-tokens/css/light.css');
@import url('@getpingback/design-tokens/css/dark.css');
```

Toggle Dark Mode by applying the class on a root container:

```html
<html class="dark">
  ...
</html>
```

Consume variables in your components:

```css
background: var(--background-default);
color: var(--text-default-primary);
```

### JS usage

```js
import { BACKGROUND_DEFAULT } from '@getpingback/design-tokens/js/light';
// or
import { BACKGROUND_DEFAULT as DARK_BACKGROUND_DEFAULT } from '@getpingback/design-tokens/js/dark';
```

## Development

Before starting development, run the following command:

```
sh npmrcconfig.sh
```

It will generate a `.npmrc` file with env tokens.

Build the tokens (CSS and JS) with:

```sh
yarn build
```

## License

Licensed under the MIT License, Copyright © 2025-present Pingback LLC.

See [LICENSE](./LICENSE) for more information.
