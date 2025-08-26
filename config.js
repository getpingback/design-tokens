import StyleDictionary from 'style-dictionary';
// import { fileHeader, formattedVariables } from 'style-dictionary/utils';
// import { propertyFormatNames } from 'style-dictionary/enums';
import {
  logBrokenReferenceLevels,
  logVerbosityLevels,
  logWarningLevels,
} from 'style-dictionary/enums';
import { register } from '@tokens-studio/sd-transforms';

register(StyleDictionary, { excludeParentKeys: true });

// StyleDictionary.registerFormat({
//   name: 'css/variables-themed',
//   format: async ({ dictionary, file, options }) => {
//     const { outputReferences, theme } = options;
//     const header = await fileHeader({ file });
//     return (
//       header +
//       `.${theme} {\n` +
//       formattedVariables({
//         format: propertyFormatNames.css,
//         dictionary,
//         outputReferences,
//       }) +
//       '\n}\n'
//     );
//   },
// });

// StyleDictionary.registerParser({
//   name: 'token-parser',
//   pattern: /\.json$/,
//   parser: ({ contents }) => {
//     const tokens = JSON.parse(contents);
//     return tokens;
//   },
// });

const sd = new StyleDictionary({
  source: ['tokens.json'],
  log: {
    warnings: logWarningLevels.warn,
    verbosity: logVerbosityLevels.default,
    errors: {
      brokenReferences: logBrokenReferenceLevels.throw,
    },
  },
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'globals.css',
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
          destination: 'variables.js',
          format: 'javascript/es6',
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
