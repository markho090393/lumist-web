<script setup lang="ts">
import { ref } from 'vue'

// 单词拓展弹窗
// - 使用 Arco Modal + UnoCSS
// - v-model 控制可见性
// - 设计稿 1:1 风格尽量还原

const visible = defineModel<boolean>({ default: false })

const props = withDefaults(
  defineProps<{
    word?: string
    ipa?: string
    meaning?: string
    // 变形：如 clouded: 过去式
    variants?: Array<{ form: string; label: string }>
    // 记忆方法
    memoryMethods?: string[]
    // 固定搭配
    collocations?: string[]
  }>(),
  {
    word: 'cloud',
    ipa: '/klaʊd/',
    meaning: 'n. 云；云朵',
    variants: () => [
      { form: 'clouding', label: '现在分词' },
      { form: 'clouds', label: '现在人称单数' },
      { form: 'clouded', label: '过去式' },
      { form: 'clouded', label: '过去分词' },
      { form: 'clouds', label: '复数' },
    ],
    memoryMethods: () => [
      '联想记忆：想像一朵云（cloud）像棉花糖一样飘在天空。',
      '发音记忆：发音类似“可捞的”，想象云朵可以捞下来。',
      '象形记忆：单词中的“c”像弯弯的云，“loud”像云里打雷的声音。',
      '词根联想：“cl-”有“聚集”的意思，云（cloud）就是水汽聚集形成的。',
      '对比记忆：把“cloud”和“loud”对比，云里打雷声音很大（loud）。',
    ],
    collocations: () => [
      'cloud cover（云层覆盖）',
      'cloud formation（云的形成）',
      'dark clouds（乌云）',
      'a cloud of dust（尘云）',
    ],
  },
)

const speak = (t?: string) => {
  const text = (t || props.word || '').trim()
  if (!text) return
  try {
    const synth = window?.speechSynthesis
    if (!synth) return
    const ut = new SpeechSynthesisUtterance(text)
    ut.rate = 0.95
    ut.pitch = 1
    ut.lang = 'en-US'
    synth.cancel()
    synth.speak(ut)
  } catch {}
}

const close = () => (visible.value = false)
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :width="920"
    :footer="false"
    title="单词拓展"
    title-align="start"
    :mask-closable="true"
    :render-to-body="false"
    :body-style="{ padding: '16px 20px 20px 20px', maxHeight: 'calc(100vh * 5 / 7)', overflowY: 'auto' }"
    :modal-style="{ borderRadius: '16px', backgroundColor: '#F3F3F3' }"
    @cancel="close"
  >
    <!-- 头部：单词 + 音标 + 发音提示 -->
    <div class="rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] p-6">
      <div class="flex items-center gap-3">
        <div class="text-[40px] leading-none font-700 text-[#2B2F36]">{{ props.word }}</div>
      </div>
      <div class="mt-2 flex items-center gap-3 text-[#6B7280]">
        <div class="text-[18px]">{{ props.ipa }}</div>
        <a-button type="text" shape="round" class="!h-6 !px-2 !text-[rgb(var(--primary-6))] !hover:text-[rgb(var(--primary-6))]" @click="speak(props.word)">
          <template #icon>
            <i class="i-ph:speaker-high text-[18px]" />
          </template>
        </a-button>
        <div class="text-[14px]">点击小喇叭可再次听单词发音</div>
      </div>
    </div>

    <!-- 基本释义 -->
    <div class="mt-4 rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] p-0 overflow-hidden">
      <div class="flex items-center gap-2 px-5 py-3">
        <i class="i-ph:book-open text-[18px] text-[#6B7280]" />
        <div class="text-[16px] font-600 text-[#2B2F36]">基本释义</div>
      </div>
      <div class="h-[1px] bg-[#E5E7EB]" />
      <div class="px-5 py-4 text-[15px] text-[#2B2F36]">{{ props.meaning }}</div>
    </div>

    <!-- 变形 -->
    <div class="mt-4 rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] p-0 overflow-hidden">
      <div class="flex items-center gap-2 px-5 py-3">
        <i class="i-ph:lightning text-[18px] text-[#6B7280]" />
        <div class="text-[16px] font-600 text-[#2B2F36]">变形</div>
      </div>
      <div class="h-[1px] bg-[#E5E7EB]" />
      <div class="px-5 py-4 grid grid-cols-3 gap-x-6 gap-y-2 text-[14px] text-[#374151]">
        <div v-for="(v, i) in props.variants" :key="i" class="whitespace-nowrap">
          <span class="font-600">{{ v.form }}：</span>
          <span class="text-[#6B7280]">{{ v.label }}</span>
        </div>
      </div>
    </div>

    <!-- 记忆方法 -->
    <div class="mt-4 rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] p-0 overflow-hidden">
      <div class="flex items-center gap-2 px-5 py-3">
        <i class="i-ph:lightbulb text-[18px] text-[#6B7280]" />
        <div class="text-[16px] font-600 text-[#2B2F36]">记忆方法</div>
      </div>
      <div class="h-[1px] bg-[#E5E7EB]" />
      <div class="px-5 py-4">
        <ol class="list-decimal pl-6 text-[14px] leading-7 text-[#374151]">
          <li v-for="(m, i) in props.memoryMethods" :key="i">{{ m }}</li>
        </ol>
      </div>
    </div>

    <!-- 固定搭配 -->
    <div class="mt-4 rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] p-0 overflow-hidden">
      <div class="flex items-center gap-2 px-5 py-3">
        <i class="i-ph:text-aa text-[18px] text-[#6B7280]" />
        <div class="text-[16px] font-600 text-[#2B2F36]">固定搭配</div>
      </div>
      <div class="h-[1px] bg-[#E5E7EB]" />
      <div class="px-5 py-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[14px] text-[#374151]">
        <div v-for="(c, i) in props.collocations" :key="i">{{ c }}</div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
:deep(.arco-modal) {
  /* 使标题区域贴近设计稿风格 */
}
</style>
