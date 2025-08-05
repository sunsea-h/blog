---
title: Eslint
categories:
  - JavaScript Engineering
date: 2025-06-24 10:05:28
updated: 2025-06-24 15:31:17
---
# Eslint

## Vue

1.安装依赖  
[eslint-plugin-vue](https://eslint.vuejs.org/user-guide/)

```sh
yarn add -D eslint eslint-plugin-vue vue-eslint-parser globals @eslint/js
```

2.初始化配置

```sh
yarn create @eslint/config
```

3.配置文件

```js
import { defineConfig } from "eslint/config";
import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  { files: ["**/*.vue"], languageOptions: { parserOptions: { parser: tseslint.parser } } },
]);

```

## React

1.安装依赖

```sh
yarn add -D eslint eslint-config-airbnb eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks
```

2.初始化配置

```sh
yarn create @eslint/config
```

3.配置文件

```js
module.exports = {
  env: {
    es6: true,
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['components', './src/components'], // alias
          ['utils', './src/utils'], // alias
        ],
      },
    },
  },
  globals: {
  },
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    camelcase: [0],
    quotes: [0],
    "class-methods-use-this": [0],
    "jsx-quotes": [0],
    "react/react-in-jsx-scope": [0],
    "react/jsx-filename-extension": [0],
    "no-trailing-spaces": [0],
    "max-len": [0],
    "no-param-reassign": [0],
    "no-plusplus": [0],
    "prefer-destructuring": [0],
    "jsx-a11y/click-events-have-key-events": [0],
    "jsx-a11y/label-has-associated-control": [0],
    "jsx-a11y/no-static-element-interactions": [0],
    "jsx-a11y/no-noninteractive-tabindex": [0],
    "jsx-a11y/anchor-is-valid": [0],
    "jsx-a11y/no-noninteractive-element-interactions": [0],
    "import/no-dynamic-require": [0],
    "import/prefer-default-export": [0],
    "import/no-cycle": [0],
    "react/require-default-props": [0],
    "react/button-has-type": [0],
    "react/destructuring-assignment": [0],
    "react/jsx-no-useless-fragment": [0],
    "react/forbid-prop-types": [0],
    "react/sort-comp": [0],
    "react/jsx-props-no-spreading": [0],
    "react/no-array-index-key": [0],
    "react/jsx-one-expression-per-line": [0],
    "react/jsx-closing-tag-location": [0],
    "operator-linebreak": [0],
    "global-require": [0],
    "object-curly-newline": [0],
    "object-curly-spacing": [0],
    "no-else-return": [0],
    "no-useless-escape": [0],
    "no-underscore-dangle": [0],
    "no-use-before-define": [0],
    "consistent-return": [0],
    "func-names": [0],
    "no-console": [0],
    "no-shadow": [0],
    "react/no-unstable-nested-components": [0],
    "linebreak-style": [0],
  },
};

```
