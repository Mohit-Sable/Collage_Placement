import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";


export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "collage-placement.onrender.com"
    ]
  }
});
