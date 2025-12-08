const prettier = require('eslint-plugin-prettier');
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const nextConfig = require('eslint-config-next');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: ['src/clients/**'],
  },
  js.configs.recommended,
  ...nextConfig,
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    plugins: {
      prettier,
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      ecmaVersion: 2020,
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'import/no-extraneous-dependencies': 'off',
      'react/jsx-filename-extension': 'off',
      'react/function-component-definition': 'off',
      'import/prefer-default-export': 'off',
      'react/jsx-props-no-spreading': 'off',
      'import/no-unresolved': 'off',
      'class-methods-use-this': 'off',
      'no-shadow': 'off',
      'no-console': 'off',
      'linebreak-style': 'off',
      'no-undef': 'off',
      'max-len': [2, 200],
      'no-param-reassign': [
        'error',
        {
          props: false,
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      // Ignore unnecessary escape characters
      'no-useless-escape': 'off',
    },
  },
];
