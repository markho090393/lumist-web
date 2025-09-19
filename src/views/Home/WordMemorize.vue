<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import LearnPracticeModal from './components/LearnPracticeModal.vue'

type CardPhase = 0 | 1 | 2 // 0: 默认, 1: 显示音标/标记, 2: 显示释义

type WordItem = {
  id: number
  text: string
  ipa?: string
  meaning?: string
  phase: CardPhase
  // 特殊：仅展示“音标”占位标签（不含实际音标文本）
  ipaPlaceholder?: boolean
}

// 顶部查询词（仅作视觉呈现，非输入框）
const queryWord = ref('cloud')
const queryHover = ref(false)

const words = reactive<WordItem[]>([
  { id: 1, text: 'sky', phase: 0 },
  { id: 2, text: 'sun', phase: 0, ipaPlaceholder: true },
  { id: 3, text: 'shine', ipa: '/ʃaɪn/', meaning: 'v. 照耀； 发光； 闪耀', phase: 0 },
  { id: 4, text: '', phase: 0 },
])

const total = computed(() => words.filter(w => w.text).length + 1 /* 含顶部查询词 */)

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

const cyclePhase = (item: WordItem) => {
  if (!item.text) return
  if (item.phase === 0) {
    item.phase = 1
  } else if (item.phase === 1) {
    item.phase = 2
  } else {
    // 第三次点击：释义消失，并朗读单词
    item.phase = 0
    speak(item.text)
  }
}

const onClickSpell = (item?: WordItem) => {
  if (item) item.phase = Math.max(item.phase, 1) as CardPhase
  openLearnModal(item)
}

const onClickExpand = (item?: WordItem) => {
  if (item) item.phase = 2
}

const currentPage = ref(1)
const pageSize = ref(5)

const onPrint = () => {
  if (typeof window !== 'undefined') window.print()
}
const onReadAll = () => {
  speak(queryWord.value)
  words.forEach((w) => w.text && speak(w.text))
}

// 学练一体弹窗
const learnVisible = ref(false)
const modal = reactive<{ word: string; ipa?: string; meaning?: string }>({ word: '' })
const openLearnModal = (item?: WordItem) => {
  const useWord = item?.text || queryWord.value
  modal.word = useWord
  modal.ipa = item?.ipa || ''
  modal.meaning = item?.meaning || ''
  learnVisible.value = true
}
</script>

<template>
  <div class="p-6">
    <!-- 顶部标题 + 操作 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-baseline gap-3">
        <div class="text-[20px] font-700 text-[#2B2F36]">单词识记</div>
        <div class="text-[14px] text-[#8E9BA7]">共{{ total }}个单词</div>
      </div>
      <div class="flex items-center gap-4">
        <a-button shape="round" class="!h-9 !px-6 !rounded-full bg-[rgba(var(--primary-6),0.9)] !border-0 text-white hover:opacity-90" @click="onPrint">
          打印
        </a-button>
        <a-button shape="round" class="!h-9 !px-6 !rounded-full bg-[#F97316] !border-0 text-white hover:opacity-95" @click="onReadAll">
          朗读
        </a-button>
      </div>
    </div>

    <!-- 查询词卡（白底，有阴影） -->
    <div
      class="rounded-2xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] h-22 flex items-center justify-between pl-6 pr-4 mb-5"
      @mouseenter="(hoverIndex = -1, queryHover = true)"
      @mouseleave="(hoverIndex = null, queryHover = false)"
    >
      <div class="text-[28px] text-[#2B2F36]">{{ queryWord }}</div>
      <div class="flex items-center gap-6">
        <a-button
          type="text"
          class="text-[#F97316] hover:text-[#ea580c] !px-0"
          v-show="queryHover"
          @click="onClickSpell()"
        >拼读</a-button>
        <a-button type="text" class="text-[rgb(var(--primary-6))] !px-0" v-show="queryHover" @click="onClickExpand()">拓展</a-button>
      </div>
    </div>

    <!-- 单词卡列表 -->
    <div class="space-y-4">
      <div
        v-for="(item, idx) in words"
        :key="item.id"
        class="rounded-2xl h-22 px-6 flex items-center justify-between cursor-pointer select-none transition-colors border"
        :class="item.phase > 0 ? 'bg-[rgb(var(--primary-6))] text-white border-transparent' : 'bg-white text-[#2B2F36] border-[#E5E7EB]'"
        @mouseenter="hoverIndex = idx"
        @mouseleave="hoverIndex = null"
        @click="cyclePhase(item)"
      >
        <!-- 左侧：单词 + 音标/占位标签 -->
        <div class="flex items-center gap-3">
          <div class="text-[28px] font-600 leading-none" :class="item.text ? '' : 'opacity-0'">{{ item.text || 'placeholder' }}</div>
          <!-- 音标占位：显示“音标”字样 -->
          <a-tag v-if="item.phase >= 1 && item.ipaPlaceholder" color="white" size="small" class="!text-[#475569]">音标</a-tag>
          <!-- 真正音标 -->
          <a-tag v-else-if="item.phase >= 1 && item.ipa" color="white" size="small" class="!text-[#475569]">{{ item.ipa }}</a-tag>
        </div>

        <!-- 右侧：操作/释义 -->
        <div class="flex items-center gap-6">
          <transition name="fade">
            <div v-if="item.phase === 2 && item.meaning" class="text-[20px] pr-2">
              {{ item.meaning }}
            </div>
          </transition>
          <div v-if="item.text" class="flex items-center gap-6">
            <a-button
              v-show="hoverIndex === idx"
              type="text"
              :class="[(item.phase>0 ? 'text-white/90 hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'),'!px-0']"
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

    <!-- 分页 -->
    <div class="mt-8 flex items-center justify-center">
      <div class="text-[#8E9BA7] mr-4">共12条</div>
      <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="12" show-jumper show-page-size />
    </div>

  </div>

  <!-- 学练一体弹窗 -->
  <LearnPracticeModal v-model="learnVisible" :word="modal.word" :ipa="modal.ipa || undefined" :meaning="modal.meaning || undefined" />
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
