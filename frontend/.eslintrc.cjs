module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    semi: ["error", "never"],
    quotes: ["error", "single"],
    "vue/html-self-closing": "off",
    "vue/multi-word-component-names": "off",
    "prettier/prettier": [
      "error",
      {
        semi: false,
        singleQuote: true,
        printWidth: 100,
        trailingComma: "es5",
        bracketSpacing: true,
        arrowParens: "avoid",
        endOfLine: "auto",
      },
    ],
  },
};
