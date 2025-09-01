import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';
import { removeCompoundTypography } from './utils/utils.js';

register(StyleDictionary, { excludeParentKeys: true });

const filterTheme = (contents, modeToDelete) => {
  const tokens = JSON.parse(contents);
  if (tokens.hasOwnProperty(modeToDelete)) {
    delete tokens[modeToDelete];
  }

  return removeCompoundTypography(tokens) ?? {};
};

StyleDictionary.registerParser({
  name: 'light-parser',
  pattern: /\.json$/,
  parser: ({ contents }) => {
    const tokens = filterTheme(contents, 'Dark Mode');
    return tokens;
  },
});

StyleDictionary.registerParser({
  name: 'dark-parser',
  pattern: /\.json$/,
  parser: ({ contents }) => {
    const tokens = filterTheme(contents, 'Light Mode');
    return tokens;
  },
});

const lightSD = new StyleDictionary({
  source: ['tokens.json'],
  preprocessors: ['tokens-studio'],
  parsers: ['light-parser'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'light.css',
          format: 'css/variables',
        },
      ],
    },
    js: {
      transformGroup: 'tokens-studio',
      buildPath: 'dist/js/',
      transforms: ['name/constant'],
      files: [
        {
          destination: 'light.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
});

const darkSD = new StyleDictionary({
  source: ['tokens.json'],
  preprocessors: ['tokens-studio'],
  parsers: ['dark-parser'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'dark.css',
          format: 'css/variables',
          options: {
            selector: '.dark',
          },
        },
      ],
    },
    js: {
      transformGroup: 'tokens-studio',
      buildPath: 'dist/js/',
      transforms: ['name/constant'],
      files: [
        {
          destination: 'dark.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
});

async function cleanAndBuild(config) {
  const sd = new StyleDictionary(config);
  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();
}

await Promise.all([cleanAndBuild(lightSD), cleanAndBuild(darkSD)]);
