import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vite";

const packageRoot = fileURLToPath(new URL(".", import.meta.url));
const source = (path: string) => resolve(packageRoot, "src", path);

export default defineConfig({
  plugins: [dts({
    entryRoot: source("."),
    outDirs: resolve(packageRoot, "dist/types"),
    tsconfigPath: resolve(packageRoot, "tsconfig.build.json"),
    copyDtsFiles: true,
  })],
  css: { modules: { generateScopedName: "ui_[name]__[local]__[hash:base64:5]" } },
  build: {
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: {
        index: source("index.ts"),
        basic: source("basic/index.ts"),
        components: source("components/index.ts"),
        forms: source("forms/index.ts"),
        validation: source("validation/index.ts"),
        i18n: source("i18n/index.ts"),
        tokens: source("tokens/index.ts"),
        styles: source("styles.ts"),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
      cssFileName: "styles",
    },
    rollupOptions: {
      external: [/^react(?:\/|$)/, /^react-dom(?:\/|$)/, /^@base-ui\/react(?:\/|$)/, /^react-hook-form(?:\/|$)/, /^zod(?:\/|$)/],
      output: {
        preserveModules: true,
        preserveModulesRoot: source("."),
      },
    },
  },
});
