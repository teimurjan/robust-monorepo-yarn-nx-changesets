import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dts({
      include: resolve(__dirname, "./src"),
      tsconfigPath: resolve(__dirname, "./tsconfig.json"),
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["@nestjs/common", "express"],
    },
  },
});
