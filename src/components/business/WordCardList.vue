<script setup lang="ts">
import { ref } from 'vue'
import type { WordCardItem } from '@/types/word'

const props = defineProps<{
  // 单词卡数据列表（组件会就地修改 phase/hidden/showIpa 字段以驱动交互）
  cards: WordCardItem[]
}>()

const emit = defineEmits<{
  (e: 'spell', item: WordCardItem): void
  (e: 'expand', item: WordCardItem): void
}>()

const hoverIndex = ref<number | null>(null)

const speak = (text?: string) => {
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

const cyclePhase = (item: WordCardItem) => {
  if (!item.text) return
  if (item.hidden) {
    item.hidden = false
    item.phase = 1
    item.showIpa = false
    return
  }
  if (item.phase === 0) {
    item.phase = 1
  } else if (item.phase === 1) {
    item.phase = 2
    speak(item.text)
  } else {
    item.hidden = true
    item.phase = 1
    item.showIpa = false
    speak(item.text)
  }
}

const toggleIpa = (item: WordCardItem) => {
  if (!item.text) return
  item.showIpa = !item.showIpa
}

const onClickSpell = (item: WordCardItem) => {
  // 确保至少进入阶段1，便于展示音标交互
  item.phase = Math.max(item.phase, 1) as typeof item.phase
  emit('spell', item)
}
const onClickExpand = (item: WordCardItem) => emit('expand', item)

const readAll = () => {
  props.cards.forEach((w) => w.text && speak(w.text))
}

defineExpose({ readAll })
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(item, idx) in cards"
      :key="item.id"
      class="rounded-2xl h-22 px-6 flex items-center justify-between cursor-pointer select-none transition-colors border"
      :class="item.phase > 0 ? 'bg-[rgb(var(--primary-6))] text-white border-transparent' : 'bg-white text-[#2B2F36] border-[#E5E7EB]'"
      @mouseenter="hoverIndex = idx"
      @mouseleave="hoverIndex = null"
      @click="cyclePhase(item)"
    >
      <!-- 左侧：单词 + 音标/占位标签 + 悬浮音标按钮（贴词左侧） -->
      <div class="flex items-center gap-3">
        <div class="text-[28px] font-600 leading-none" :class="item.text && !item.hidden ? '' : 'opacity-0'">{{ item.text || 'placeholder' }}</div>
        <!-- 悬浮时显示为按钮的“音标”标签（点击切换显示音标） -->
        <a-tag
          v-if="hoverIndex === idx && item.text && !item.hidden && !item.showIpa && item.phase > 0"
          color="white"
          size="small"
          class="!text-[#475569] cursor-pointer !px-2 !py-0.5 hover:opacity-90"
          @click.stop="toggleIpa(item)"
        >音标</a-tag>
        <!-- 音标占位：显示“音标”字样（已展开时） -->
        <a-tag
          v-if="item.showIpa && item.ipaPlaceholder && !item.hidden"
          color="white"
          size="small"
          class="!text-[#475569] cursor-pointer hover:opacity-90"
          @click.stop="toggleIpa(item)"
        >音标</a-tag>
        <!-- 真正音标（已展开时） -->
        <a-tag
          v-else-if="item.showIpa && item.ipa && !item.hidden"
          color="white"
          size="small"
          class="!text-[#475569] cursor-pointer hover:opacity-90"
          @click.stop="toggleIpa(item)"
        >{{ item.ipa }}</a-tag>
      </div>

      <!-- 右侧：操作/释义 -->
      <div class="flex items-center gap-6">
        <transition name="fade">
          <div v-if="item.phase === 2 && item.meaning && !item.hidden" class="text-[20px] pr-2">
            {{ item.meaning }}
          </div>
        </transition>
        <div v-if="item.text && !item.hidden" class="flex items-center gap-6">
          <!-- 右侧“音标”按钮已移至左侧并样式化为白色圆角标签，这里不再展示以避免重复 -->
          <a-button
            v-show="hoverIndex === idx"
            type="text"
            :class="[(item.phase>0 ? 'text-white/90 hover:text-white' : 'text-[#FF7D00] hover:text-[#FF7D00]'),'!px-0']"
            @click.stop="onClickSpell(item)"
          >拼读</a-button>
          <a-button
            v-show="hoverIndex === idx"
            type="text"
            :class="[(item.phase>0 ? 'text-white/90 hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'),'!px-0']"
            @click.stop="onClickExpand(item)"
          >拓展</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
