import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import "./index.css";
import "./App.css";

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
