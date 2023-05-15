![Stash Icons Cover](https://res.cloudinary.com/pingback/image/upload/v1684178797/stash-assets/Templates_oum6vi.png)

<div align="center"><strong>@getpingback/design-tokens</strong></div>
<div align="center">All design tokens into a JSON file for multiple projects.</div>
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

Get access to design tokens based on the theme you want.

```jsx
import { ThemeProvider } from '@getpingback/realeza';
import { lightTheme, darkTheme } from '@getpingback/design-tokens';

const App = () => {
  return (
    <ThemeProvider theme={lightTheme}>
     ...
    </ThemeProvider>
  );
};
```

## License

Licensed under the MIT License, Copyright © 2023-present Pingback LLC.

See [LICENSE](./LICENSE) for more information.
