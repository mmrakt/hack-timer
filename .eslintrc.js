module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json'
  },
  plugins: ['react'],
  rules: {
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/consistent-type-definitions': 0,
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'multiline-ternary': 0
  },
  ignorePatterns: [
    'src/vite-env.d.ts',
    'jest.config.ts',
    'jest.setup.ts',
    'vite.config.ts'
  ]
}
