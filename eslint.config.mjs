import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.mjs"], languageOptions: { sourceType: "module" } },
  { files: ["**/*.{js,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node, sourceType: "commonjs" } },
  { files: ["src/**/*.js", "!src/tests/**"], languageOptions: { globals: globals.browser } },
  { files: ["src/tests/**/*.js"], languageOptions: { globals: { ...globals.browser, ...globals.jest } } },
]);
