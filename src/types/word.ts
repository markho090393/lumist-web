export type CardPhase = 0 | 1 | 2 // 0: 默认, 1: 显示音标/标记, 2: 显示释义

export type WordCardItem = {
  id: number
  text: string
  ipa?: string
  meaning?: string
  phase: CardPhase
  hidden?: boolean
  showIpa?: boolean
  // 特殊：仅展示“音标”占位标签（不含实际音标文本）
  ipaPlaceholder?: boolean
}
