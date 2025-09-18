import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        // 官方推荐：通过 arcoblue-6 覆盖主色
        modifyVars: {
          'arcoblue-6': '#359186',
        },
        javascriptEnabled: true,
      },
    },
  },
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
          // 为了让 modifyVars 生效，切换为 less 源样式
          importStyle: 'less',
          sideEffect: true,
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
