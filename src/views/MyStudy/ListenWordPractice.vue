<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

// 简单的题目模型与进度（后续可替换为接口数据）
type Option = { label: string; text: string }
type Question = { word: string; options: Option[]; answerIndex: number }

const question = reactive<Question>({
  word: 'Zoom',
  options: [
    { label: 'A', text: '动物园' },
    { label: 'B', text: '袋鼠' },
    { label: 'C', text: '房间' },
    { label: 'D', text: '能够' },
  ],
  answerIndex: 0,
})

const finished = ref(10)
const total = ref(15)
const correct = ref(10)
const wrong = ref(0)
const accuracy = computed(() => (total.value ? Math.round((correct.value / total.value) * 100) : 0))

const selected = ref<number | null>(null)
const isCorrect = computed(() => selected.value === question.answerIndex)

const choose = (idx: number) => {
  if (selected.value !== null) return
  selected.value = idx
  if (idx === question.answerIndex) correct.value += 0
  else wrong.value += 0
}

const next = () => {
  // 最小实现：仅重置作答状态以演示交互
  selected.value = null
}

const baseBtn = 'w-full h-16 rounded-xl border px-5 flex items-center gap-3 text-[18px] transition-all duration-200 select-none'
const toClasses = (idx: number) => {
  const isSel = selected.value === idx
  const isAns = question.answerIndex === idx
  if (selected.value === null) return `${baseBtn} bg-[#F3F4F6] text-[#666] hover:bg-[#EDEFF2]`
  if (isSel && isAns) return `${baseBtn} bg-[#E7FBF3] border-2 border-[#2E9885] text-[#2E9885]`
  if (isSel && !isAns) return `${baseBtn} bg-[#FFEDED] border-2 border-[#F36C6C] text-[#D44A4A]`
  if (!isSel && isAns) return `${baseBtn} bg-[#F3F4F6] border-2 border-dashed border-[#2E9885] text-[#2E9885]`
  return `${baseBtn} bg-[#F3F4F6] text-[#9AA3AF]`
}
</script>

<template>
  <div class="p-6">
    <div class="text-[20px] font-700 text-[#2B2F36] mb-4">听音辨词</div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 左侧：学习进度 + 学习技巧 -->
      <div class="space-y-6">
        <div class="rounded-xl bg-white p-5 shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
          <div class="text-[16px] font-700 text-[#2B2F36] mb-4">学习进度</div>
          <div class="text-[13px] text-[#64748B] mb-2">已完成单词 <span class="text-[#16A34A]">{{ finished }}/{{ total }}</span></div>
          <div class="h-2 rounded bg-[#E5E7EB] overflow-hidden mb-3">
            <div class="h-full bg-[#16A34A]" :style="{ width: `${Math.round((finished/total)*100)}%` }"></div>
          </div>
          <div class="text-[13px] text-[#64748B] mb-2">正确率 <span class="text-[#16A34A]">{{ accuracy }}%</span></div>
          <div class="h-2 rounded bg-[#E5E7EB] overflow-hidden">
            <div class="h-full bg-[#16A34A]" :style="{ width: `${accuracy}%` }"></div>
          </div>
          <div class="mt-4 space-y-2">
            <div class="flex items-center gap-2 text-[#16A34A]"><i class="i-ph:check-circle text-[16px]"></i><span>正确</span><span class="ml-auto text-[#2B2F36]">{{ correct }}</span></div>
            <div class="flex items-center gap-2 text-[#EF4444]"><i class="i-ph:x-circle text-[16px]"></i><span>错误</span><span class="ml-auto text-[#2B2F36]">{{ wrong }}</span></div>
          </div>
        </div>

        <div class="rounded-xl bg-white p-5 shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
          <div class="text-[16px] font-700 text-[#2B2F36] mb-4">学习技巧</div>
          <div class="space-y-3 text-[#475569] text-[14px]">
            <div class="flex items-start gap-3">
              <span class="w-6 h-6 rounded bg-[#E6FFF4] text-[#16A34A] inline-flex items-center justify-center text-[12px]">1</span>
              <span>仔细聆听单词的发音，注意重音位置</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="w-6 h-6 rounded bg-[#E6FFF4] text-[#16A34A] inline-flex items-center justify-center text-[12px]">2</span>
              <span>尝试跟读，提高发音准确度</span>
            </div>
            <div class="flex items-start gap-3">
              <span class="w-6 h-6 rounded bg-[#E6FFF4] text-[#16A34A] inline-flex items-center justify-center text-[12px]">3</span>
              <span>记录错误单词，重点复习</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：练习面板 -->
      <div class="col-span-2 rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
        <div class="p-6 md:p-10">
          <div class="text-[18px] font-700 text-[#2B2F36]">单词听力练习</div>
          <div class="text-[#9AA3AF] mt-1">听音选择正确的中文含义</div>

          <div class="mt-6 flex flex-col items-center">
            <div class="w-14 h-14 rounded-full bg-[#E6FFF4] flex items-center justify-center text-[#2E9885]">
              <i class="i-ph:speaker-high-bold text-[22px]"></i>
            </div>
            <div class="text-[#9AA3AF] text-[12px] mt-2">点击听发音</div>
          </div>

          <div class="mt-8 grid grid-cols-2 gap-6 max-w-[860px] mx-auto">
            <button v-for="(op, idx) in question.options" :key="op.label" type="button" :class="toClasses(idx)" @click="choose(idx)">
              <span>{{ op.text }}</span>
            </button>
          </div>

          <div class="mt-10 flex items-center justify-center">
            <a-button shape="round" class="!h-11 !px-10 !rounded-full bg-[rgba(var(--primary-6),0.95)] !border-0 text-white hover:opacity-90" @click="next">
              下一个
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

