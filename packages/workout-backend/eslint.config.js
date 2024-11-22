import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Special config for test files
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest, // Adds jest globals like describe, it, expect
      },
    },
  },
  {
    rules: {
      // Allow unused parameters (like 'next' in Express middleware)
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^next$",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
