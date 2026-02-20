import js from "@eslint/js";
import nodePlugin from "eslint-plugin-node";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      node: nodePlugin,
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_|^next$|^req$|^res$" },
      ],
      "no-console": "off",
      "no-process-exit": "off",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "multi-line"],
      "no-throw-literal": "error",
      "no-return-await": "warn",
      "require-await": "warn",
    },
  },
  {
    ignores: ["node_modules/", "tests/", "scripts/", "coverage/"],
  },
];
