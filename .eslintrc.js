module.exports = {
  root: true,
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['prettier'],
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
  },
};
