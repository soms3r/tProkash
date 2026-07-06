/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  printWidth: 100,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  overrides: [
    {
      files: "*.md",
      options: {
        proseWrap: "always",
        printWidth: 80,
      },
    },
  ],
};
