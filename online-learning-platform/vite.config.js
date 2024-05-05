import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { vitestConfig } from "vite-plugin-vitest-config";

export default defineConfig({
  plugins: [react(), visualizer(), vitestConfig()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});
