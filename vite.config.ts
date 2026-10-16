import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here: string = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: resolve(here, "demo"),
  build: {
    outDir: resolve(here, "dist"),
    emptyOutDir: true,
  },
});