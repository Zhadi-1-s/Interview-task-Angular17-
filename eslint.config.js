// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  // JS базовый набор
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // Angular TypeScript rules
  ...angular.configs["all"],

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      }
    },
    rules: {}
  },

  // HTML Template rules
  ...angular.configs["template/all"],
  {
    files: ["**/*.html"],
    rules: {}
  },

  // Prettier
  {
    plugins: {
      prettier: (await import("eslint-plugin-prettier")).default,
    },
    rules: {
      "prettier/prettier": "error",
    }
  }
];
