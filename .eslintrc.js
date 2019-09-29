module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-console': 0,
    'no-underscore-dangle': ["error", { "allow": ['_id'] }],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    'no-unused-vars': 1,
    'no-param-reassign': ["error", { "props": false }],
    'consistent-return': 0
  },
};
