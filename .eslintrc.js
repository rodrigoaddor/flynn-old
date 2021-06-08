module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
      "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 'ESNEXT',
    sourceType: "module"
  }
};
