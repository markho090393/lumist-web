import { defineConfig, presetAttributify, presetWind4, presetIcons, presetWebFonts, presetTypography, presetTagify ,transformerVariantGroup, transformerDirectives, } from 'unocss'

export default defineConfig({
  presets: [
    // 提升 UNO 原子类优先级：将所有规则作用域提升到 #app，提高选择器特异性
    // 如不希望全局生效，可改为 true（加 !important）或移除该配置按需使用 "!" 变体
    presetWind4({ important: '#app' }),
    presetIcons(),
    presetAttributify(),
    presetTagify(),
    presetTypography(),
    presetWebFonts()
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
