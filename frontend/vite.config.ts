import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Add this section to define process.env
    'process.env': {
      NODE_ENV: JSON.stringify(mode),
      // Add any other environment variables Excalidraw might need
      REACT_APP_BACKEND_V2_GET_URL: JSON.stringify(process.env.REACT_APP_BACKEND_V2_GET_URL || ''),
      REACT_APP_BACKEND_V2_POST_URL: JSON.stringify(process.env.REACT_APP_BACKEND_V2_POST_URL || ''),
    }
  },
}));
