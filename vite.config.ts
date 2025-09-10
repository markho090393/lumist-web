import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      resolvers: [
        ArcoResolver(),
      ],
    }),
    Components({
      // 生成全局组件类型声明文件，提升DX
      dts: 'src/components.d.ts',
      // Arco 按需自动引入组件与样式（CSS，避免引入 less 依赖）
      resolvers: [
        ArcoResolver({
          importStyle: 'css',
          sideEffect: true
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
