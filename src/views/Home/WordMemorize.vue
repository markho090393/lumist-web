<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import LearnPracticeModal from './components/LearnPracticeModal.vue'
import WordExpandModal from './components/WordExpandModal.vue'
import WordCardList from '@/components/business/WordCardList.vue'
import type { WordCardItem } from '@/types/word'

const queryCard = reactive<WordCardItem>({
  id: 0,
  text: 'cloud',
  phase: 0,
  hidden: false,
  showIpa: false,
})

const words = reactive<WordCardItem[]>([
  { id: 1, text: 'sky', phase: 0, hidden: false, showIpa: false },
  { id: 2, text: 'sun', phase: 0, hidden: false, showIpa: false, ipaPlaceholder: true },
  { id: 3, text: 'shine', ipa: '/ʃaɪn/', meaning: 'v. 照耀； 发光； 闪耀', phase: 0, hidden: false, showIpa: false },
  { id: 4, text: '', phase: 0, hidden: false, showIpa: false },
])

const wordCards = computed(() => [queryCard, ...words])
const total = computed(() => wordCards.value.filter(w => w.text).length)

const onClickSpell = (item: WordCardItem) => {
  openLearnModal(item)
}

const onClickExpand = (item: WordCardItem) => {
  openExpandModal(item)
}

const currentPage = ref(1)
const pageSize = ref(5)

const onPrint = () => {
  if (typeof window !== 'undefined') window.print()
}
type WordCardListExposed = { readAll: () => void }
const wordCardListRef = ref<WordCardListExposed | null>(null)
const onReadAll = () => wordCardListRef.value?.readAll()

// 学练一体弹窗
const learnVisible = ref(false)
const modal = reactive<{ word: string; ipa?: string; meaning?: string }>({ word: '' })
const openLearnModal = (item: WordCardItem) => {
  modal.word = item.text
  modal.ipa = item.ipa || ''
  modal.meaning = item.meaning || ''
  learnVisible.value = true
}

// 单词拓展弹窗
const expandVisible = ref(false)
const expand = reactive<{ word: string; ipa?: string; meaning?: string }>({ word: '' })
const openExpandModal = (item: WordCardItem) => {
  expand.word = item.text
  expand.ipa = item.ipa || ''
  expand.meaning = item.meaning || ''
  expandVisible.value = true
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

    <!-- 单词卡列表（公共业务组件） -->
    <WordCardList ref="wordCardListRef" :cards="wordCards" @spell="onClickSpell" @expand="onClickExpand" />

    <!-- 分页 -->
    <div class="mt-8 flex items-center justify-center">
      <div class="text-[#8E9BA7] mr-4">共12条</div>
      <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="12" show-jumper show-page-size />
    </div>

  </div>

  <!-- 学练一体弹窗 -->
  <LearnPracticeModal v-model="learnVisible" :word="modal.word" :ipa="modal.ipa || undefined" :meaning="modal.meaning || undefined" />

  <!-- 单词拓展弹窗 -->
  <WordExpandModal v-model="expandVisible" :word="expand.word" :ipa="expand.ipa || undefined" :meaning="expand.meaning || undefined" />
</template>

<style scoped>
</style>
