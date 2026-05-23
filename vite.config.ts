import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { youtubeTranscriptApi } from "./vite-plugin-youtube";

export default defineConfig({
  plugins: [react(), youtubeTranscriptApi()],
});
