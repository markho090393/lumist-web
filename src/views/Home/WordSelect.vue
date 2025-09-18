<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

type WordItem = {
  id: number
  word: string
  remark?: string
  strong?: boolean
  answer?: 'yes' | 'no' | null
}

const order = ref<'sequence' | 'random'>('sequence')

const state = reactive<{ list: WordItem[]; shuffled: WordItem[] | null }>({
  list: [
    { id: 1, word: 'cloud', answer: 'yes' },
    { id: 2, word: 'sun', answer: 'yes' },
    { id: 3, word: 'sky', answer: null },
    { id: 4, word: 'shine', remark: 'n.太阳；阳光', strong: true, answer: 'no' },
    { id: 5, word: 'with', answer: 'yes' },
    { id: 6, word: 'family', answer: 'yes' },
  ],
  shuffled: null,
})

const shuffle = (arr: WordItem[]) => {
  const a: WordItem[] = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = a[i]!
    a[i] = a[j]!
    a[j] = temp
  }
  return a
}

watch(
  () => order.value,
  (mode) => {
    if (mode === 'random') state.shuffled = shuffle(state.list)
  },
  { immediate: true },
)

const displayList = computed(() => (order.value === 'random' ? state.shuffled ?? state.list : state.list))

const yesCount = computed(() => state.list.filter((w) => w.answer === 'yes').length)
const noCount = computed(() => state.list.filter((w) => w.answer === 'no').length)

const setAnswer = (item: WordItem, val: 'yes' | 'no') => {
  item.answer = val
}

const start = () => {
  // 后续可在此将选择结果提交或路由跳转
}
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="text-[16px] text-[#2B2F36]">选择不会的单词开始训练</div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-[14px]">
          <i class="i-ph:check-circle text-[rgb(var(--primary-6))]" />
          <a-radio-group v-model="order" type="button" size="small">
            <a-radio value="sequence">顺序</a-radio>
            <a-radio value="random">乱序</a-radio>
          </a-radio-group>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 px-2.5 h-7 rounded-full bg-[#16A34A] text-white text-[12px]">
            <i class="i-ph:check-circle-fill" />
            <span>Yes {{ yesCount }}个</span>
          </div>
          <div class="flex items-center gap-1 px-2.5 h-7 rounded-full bg-[#F97316] text-white text-[12px]">
            <i class="i-ph:question-fill" />
            <span>No {{ noCount }}个</span>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="item in displayList"
        :key="item.id"
        class="rounded-xl bg-[#F6F7F9] border border-white px-4 h-16 flex items-center justify-between"
      >
        <div class="flex items-baseline gap-3">
          <div :class="['text-[20px]', item.strong ? 'font-700' : 'font-500']">{{ item.word }}</div>
          <div v-if="item.remark" class="text-[14px] text-[#6B7280]">{{ item.remark }}</div>
        </div>

        <div class="flex items-center gap-3">
          <!-- Yes -->
          <a-button
            size="small"
            shape="round"
            class="h-8 px-3 rounded"
            :class="
              item.answer === 'yes'
                ? 'bg-[#16A34A] !border-0 text-white'
                : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
            "
            @click="setAnswer(item, 'yes')"
          >
            <span class="inline-flex items-center gap-1">
              <div v-if="item.answer === 'yes'" class="i-ph:check-circle-fill text-lg" />
              Yes
            </span>
          </a-button>

          <!-- No -->
          <a-button
            size="small"
            shape="round"
            class="h-8 px-3 rounded"
            :class="
              item.answer === 'no'
                ? 'bg-[#F97316] !border-0 text-white'
                : '!bg-white !text-[#6B7280] !border !border-[#E5E7EB]'
            "
            @click="setAnswer(item, 'no')"
          >
            <span class="inline-flex items-center gap-1">
              <div v-if="item.answer === 'no'" class="i-ph:x-circle-fill text-lg" />
              No
            </span>
          </a-button>
        </div>
      </div>
    </div>

    <div class="mt-10 flex justify-center">
      <a-button type="primary"  class="h-14 px-16 text-18px font-600" @click="start">
        开始训练
      </a-button>
    </div>
  </div>
  
</template>
