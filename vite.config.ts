import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueImportProps from "unplugin-vue-import-props/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueImportProps()]
})
