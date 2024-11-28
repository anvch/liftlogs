import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jest from "eslint-plugin-jest";

export default [
  { ignores: ["dist", "coverage"] },
  {
    env: {
      browser: true,
      node: true,
      jest: true, // Enables globals like `global`, `describe`, `it`, etc.
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Add Jest-specific configuration
    files: ["**/*.test.{js,jsx}"], // Only apply to test files
    languageOptions: {
      globals: { ...globals.jest }, // Include Jest globals
    },
    plugins: {
      jest,
    },
    rules: {
      ...jest.configs.recommended.rules, // Add Jest recommended rules
    },
  },
];
