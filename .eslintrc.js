module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'plugin:jest/recommended',
    'plugin:jest/style',
    'airbnb-typescript',
    'prettier',
  ],
  settings: {
    jest: {
      version: 27,
    },
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
