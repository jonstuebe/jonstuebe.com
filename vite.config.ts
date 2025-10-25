import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import oxlintPlugin from "vite-plugin-oxlint";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
    oxlintPlugin({
      params: "--type-aware",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
