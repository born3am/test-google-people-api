module.exports = {
  arrowParens: 'always',
  bracketSpacing: true,
  bracketSameLine: false,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'css',
  jsxSingleQuote: true,
  printWidth: 160,
  proseWrap: 'never',
  quoteProps: 'as-needed',
  rangeStart: 0,
  rangeEnd: Infinity,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all', // 'all' is default setting since Prettier V3.0
  useTabs: false,

  // Ensure Prettier respects JSON files width
  overrides: [
    {
      files: ['*.json'],
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'preserve', // Prevent unwanted line breaks
      },
    },
  ],
};
