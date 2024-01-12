module.exports = {
  // =================================
  // 1) Global ESLint Settings
  // =================================
  root: true, // 'root: true' makes this eslint config apply to files in this directory and subdirectories only
  env: {
    es2024: true, // adds modern ECMAScript global variables (avoid use of 'latest' option because it can led to unexpected results)
    browser: true, // ensures ESLint understands browser-specific global variables
    node: true, // ensures ESLint understands Node.js-specific global variables
  },
  globals: {
    React: 'writable', // Commonly used in projects that use libraries like React, where React is a global variable available. It's a way to inform ESLint about additional global variables your code relies on that aren't defined within your codebase.
  },
  ignorePatterns: ['*config.js', 'demo/', 'bin/', 'eslint*', 'webpack*'], // ignore linting over these files and directories
  settings: {
    react: {
      version: 'detect', // "detect" automatically picks the React version you have installed (if is the case). React version will be then shared among react plugins and extends.
    },
  },

  // ===========================================
  // 2) Set up ESLint for all file types
  // (Using built-in parser 'espree', which is the default parser for ESLint)
  // ===========================================

  parserOptions: {
    ecmaVersion: '2024', // Allows parsing of modern ECMAScript features (avoid use od 'latest' option because it can led to unexpected results)
    sourceType: 'module', // Indicates the use of ECMAScript modules (enables the use of 'import' and 'export' statements).
    ecmaFeatures: {
      jsx: true, // Enables parsing of JSX syntax commonly used in React applications.
    },
  },

  // =================================
  // 3) Plugins
  // (Rules from these packages can be used if set inside 'rules: {}')
  // =================================
  // 'prettier' should be at the end
  // These 2 packages work together for PLUGIN: "prettier": https://www.npmjs.com/package/eslint-config-prettier and https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
  // 'add' here only 'prettier' plugin and further on enable the rule 'prettier/prettier': 'error',
  // To check for conflicting settings between ESLint/Prettier, run: npx eslint-config-prettier *.*

  plugins: ['import', 'promise', 'sort-exports', 'prettier'],

  // =================================
  // 4) Extend Other Configs
  // (Rules from these packages are automatically inherited)

  // CUSTOMIZATIONS: Comment out or in the REACT extends to disable or enable React rules

  // =================================
  extends: [
    // OPTIONAL EXTENDS (based on project profile)
    'plugin:jsx-a11y/recommended',
    // 'plugin:react/recommended',
    // 'plugin:react/jsx-runtime',
    // 'plugin:react-hooks/recommended',
  ],

  // =================================
  // 5) Set Rules
  // =================================
  rules: {
    // Options: 'error' or 'warn' or 'off'

    // Rules from PLUGINS

    // Rules for Prettier. Adjust rules to consider prettierrc file settings:
    'prettier/prettier': [
      'error',
      // Empty object to use Prettier default options
      {},
      // Set to 'true' to use .prettierrc config file rules
      {
        usePrettierrc: true,
      },
    ],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',

    // Rules to enforce best practices for JavaScript promises: https://www.npmjs.com/package/eslint-plugin-promise
    'promise/always-return': 'error',
    'promise/catch-or-return': 'error',
    'promise/no-callback-in-promise': 'warn',
    'promise/no-multiple-resolved': 'warn',
    'promise/no-new-statics': 'error',
    'promise/no-nesting': 'warn',
    'promise/no-promise-in-callback': 'warn',
    'promise/no-return-in-finally': 'warn',
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/prefer-await-to-callbacks': 'warn',
    'promise/valid-params': 'warn',

    // Rules for export and import statements: https://www.npmjs.com/package/eslint-plugin-import and https://www.npmjs.com/package/eslint-plugin-sort-exports
    'sort-exports/sort-exports': [
      'warn',
      {
        sortDir: 'asc',
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'object', 'type', 'unknown'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-deprecated': 'error',

    // Rules for REACT
    // 'react/sort-default-props': [
    //   'error',
    //   {
    //     ignoreCase: true,
    //   },
    // ],
    // 'react/jsx-sort-props': [
    //   'error',
    //   {
    //     callbacksLast: true,
    //     shorthandFirst: false,
    //     shorthandLast: true,
    //     multiline: 'last',
    //     ignoreCase: true,
    //     noSortAlphabetically: false,
    //   },
    // ],
    // 'react/no-invalid-html-attribute': 'error',
    // 'react/sort-comp': [
    //   'error',
    //   {
    //     order: ['static-methods', 'instance-variables', 'lifecycle', 'everything-else', '/^on.+$/', 'render'],
    //     groups: {
    //       lifecycle: [
    //         'displayName',
    //         'propTypes',
    //         'contextTypes',
    //         'childContextTypes',
    //         'mixins',
    //         'statics',
    //         'defaultProps',
    //         'constructor',
    //         'getDefaultProps',
    //         'state',
    //         'getInitialState',
    //         'getChildContext',
    //         'getDerivedStateFromProps',
    //         'componentWillMount',
    //         'UNSAFE_componentWillMount',
    //         'componentDidMount',
    //         'componentWillReceiveProps',
    //         'UNSAFE_componentWillReceiveProps',
    //         'shouldComponentUpdate',
    //         'componentWillUpdate',
    //         'UNSAFE_componentWillUpdate',
    //         'getSnapshotBeforeUpdate',
    //         'componentDidUpdate',
    //         'componentDidCatch',
    //         'componentWillUnmount',
    //       ],
    //     },
    //   },
    // ],

    // Rules from ESLINT
    'array-callback-return': 'off',
    'comma-dangle': ['error', 'always-multiline'], // Prettier has its own way of handling trailing commas based on the trailingComma option in its configuration.
    'constructor-super': 'error',
    curly: 'error', // Prettier automatically formats curly braces and could conflict with this rule.
    eqeqeq: ['warn', 'always'],
    'for-direction': 'error',
    'id-length': 'warn',
    'no-cond-assign': 'error',
    'no-const-assign': 'error',
    'no-dupe-args': 'error',
    'no-dupe-class-members': 'error',
    'no-duplicate-case': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-fallthrough': 'error',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-invalid-this': 'error',
    'no-lonely-if': 'error',
    'no-nested-ternary': 'error',
    'no-new-wrappers': 'error',
    'no-param-reassign': 'error',
    'no-prototype-builtins': 'off',
    'no-redeclare': 'error',
    'no-regex-spaces': 'error',
    'no-sequences': 'error',
    'no-shadow': [
      'error',
      {
        hoist: 'all',
      },
    ],
    'no-sparse-arrays': 'error',
    'no-throw-literal': 'error',
    'no-unreachable': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    'no-unsafe-optional-chaining': 'error',
    'no-unused-labels': 'error',
    'no-unused-vars': [
      'warn',
      {
        args: 'none',
      },
    ],
    'no-useless-catch': 'warn',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'prefer-const': 'warn',
    'prefer-destructuring': [
      'warn',
      {
        object: true,
        array: false,
      },
    ],
    'prefer-object-spread': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-template': 'error', // Prettier could potentially format template literals and strings in a way that conflicts with this rule.
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ], // Prettier has its own rule for quotes based on the singleQuote option in its configuration.
    'sort-vars': [
      'error',
      {
        ignoreCase: true,
      },
    ],
    'use-isnan': 'error',
  },

  // =================================
  // 6) Overrides for Specific Files: TYPESCRIPT, JEST
  // =================================
  overrides: [
    // TYPESCRIPT
    // https://typescript-eslint.io/getting-started
    // https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js#L10
    {
      // =================================
      // 6.TS.1) Match TypeScript Files
      // =================================
      files: ['**/*.{ts,tsx}'],

      // =================================
      // 6.TS.2) Global ESLint Settings
      // =================================
      env: {},
      settings: {},

      // =================================
      // 6.TS.3) Parser Settings
      // =================================
      // allow ESLint to understand TypeScript syntax
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname, // Help to resolve relative path to tsconfig.json
        project: './tsconfig.json', // Specify the path to your tsconfig.json
      },

      // =================================
      // 6.TS.4) Plugins
      // =================================
      plugins: ['@typescript-eslint', 'typescript-sort-keys'],

      // =================================
      // 6.TS.5) Extend Other Configs

      // CUSTOMIZATIONS: Comment out or in the TYPESCRIPT extend to disable or enable TypeScript rules

      // =================================
      extends: [],

      // =================================
      // 6.TS.6) Set rules
      // =================================
      rules: {
        // Options: 'error' or 'warn' or 'off'

        // Rules for TYPESCRIPT-SORT-KEYS
        'typescript-sort-keys/interface': 'error',
        'typescript-sort-keys/string-enum': 'error',

        // Rules for TYPESCRIPT-ESLINT
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/no-empty-function': 'error',
        '@typescript-eslint/no-empty-interface': 'warn',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',

        // Disable eslint-no-shadow rule and enable @typescript-eslint/no-shadow rule to solve conflict (https://github.com/typescript-eslint/typescript-eslint/issues/2483)
        'no-shadow': 'off',

        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-this-alias': [
          'error',
          {
            allowDestructuring: true,
          },
        ],
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-unnecessary-type-constraint': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/prefer-for-of': 'warn',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-includes': 'warn',
        '@typescript-eslint/prefer-namespace-keyword': 'warn',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/promise-function-async': 'warn',
        '@typescript-eslint/require-array-sort-compare': 'off',
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/return-await': ['error', 'in-try-catch'],
        '@typescript-eslint/semi': 'error',
        '@typescript-eslint/triple-slash-reference': 'error',
        '@typescript-eslint/typedef': 'error',
        '@typescript-eslint/unified-signatures': 'warn',
      },
    },
    // JEST
    {
      // =================================
      // 6.JEST.1) Match Jest Test Files
      // =================================
      files: ['**/*.test.js', '**/*.test.ts', '**/*.test.tsx'],

      // =================================
      // 6.JEST.2) Global ESLint Settings

      // CUSTOMIZATIONS: Comment out or in the JEST env according to your project needs

      // =================================
      env: {
        'jest/globals': true, // ensures ESLint understands Jest-specific global variables: https://www.npmjs.com/package/eslint-plugin-jest
      },
      settings: {},

      // =================================
      // 6.JEST.3) Parser Settings
      // =================================
      //  -- // --

      // =================================
      // 6.JEST.4) Plugins
      // =================================
      plugins: ['jest'],

      // =================================
      // 6.JEST.5) Extend Other Configs

      // CUSTOMIZATIONS: Comment out or in the JEST extends to disable or enable Jest rules

      // =================================
      extends: ['plugin:jest/style', 'plugin:jest/recommended'],
      // =================================
      // 6.JEST.6) Set rules
      // =================================
      // Rules will be applied by extends
      rules: {},
    },
  ],
};
