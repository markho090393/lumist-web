<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 页面状态：未开始/测试中
const testing = ref(false)

// 倒计时（秒）
const DURATION = 15
const remain = ref(DURATION)
let timer: number | null = null

const startTimer = () => {
  clearTimer()
  remain.value = DURATION
  timer = window.setInterval(() => {
    if (remain.value > 0) {
      remain.value -= 1
    } else {
      clearTimer()
    }
  }, 1000)
}

const clearTimer = () => {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
}

onBeforeUnmount(clearTimer)

// 题目模型（最小可用实现，后续可替换为接口）
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

// 选择状态
const selected = ref<number | null>(null)
const isCorrect = computed(() => selected.value === question.answerIndex)

const begin = () => {
  testing.value = true
  selected.value = null
  startTimer()
}

const choose = (idx: number) => {
  if (selected.value !== null) return
  selected.value = idx
  clearTimer()
}

const notKnow = () => {
  if (selected.value !== null) return
  selected.value = -1
  clearTimer()
}

// 返回首页
const router = useRouter()
const backHome = () => router.push('/home')

// 字体与颜色工具
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

onMounted(() => {
  // 保持首屏为“未开始检测”静态态
})
</script>

<template>
  <div class="p-6">
    <div class="text-[20px] font-700 text-[#2B2F36] mb-4">词汇量检测</div>

    <!-- 未开始：首屏引导 -->
    <div v-if="!testing" class="space-y-6">
      <div class="grid grid-cols-3 gap-6">
        <div class="col-span-2 rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
          <div class="p-4 sm:p-6 md:p-10">
            <div class="text-[28px] font-700 text-[#2E6F67] mb-3">测试你的词汇量水平</div>
            <div class="text-[#64748B] text-[14px] leading-7 mb-6">
              快速评估你的词汇量，估你在不同难度等级的词汇掌握程度，帮助你更好地了解自己的语言水平。
            </div>
            <a-button shape="round" class="!h-10 !px-7 !rounded-full bg-[rgba(var(--primary-6),0.95)] !border-0 text-white hover:opacity-90" @click="begin">
              立即开始测试
            </a-button>
          </div>
        </div>
        <div class="col-span-1 rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
          <div class="p-4"><div class="h-[220px] bg-[#F2F3F5] rounded-[12px]"></div></div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <div v-for="(f, i) in 3" :key="i" class="rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
          <div class="flex items-start gap-3 p-5">
            <div class="w-12 h-12 rounded bg-[#E5E7EB]"></div>
            <div>
              <div class="text-[18px] font-700 text-[#2B2F36] mb-1">{{ ['科学评估','即时反馈','个性化报告'][i] }}</div>
              <div class="text-[#8E9BA7]">{{ ['采用国际标准词汇测试方法，准确评估你的词汇水平','测试完成后立即获得详细的评估报告和分析','根据测试结果提供个性化的学习建议和提升方案'][i] }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 测试中：题目与交互 -->
    <div v-else class="">
      <div class="rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
        <div class="p-6 md:p-10">
          <!-- 计时器与单词行 -->
          <div class="flex items-center justify-center mb-6">
            <div class="w-12 h-12 rounded-full border-2 border-[#2E9885] flex items-center justify-center text-[#2E9885] font-700">{{ remain }}</div>
          </div>

          <div class="flex items-center justify-center gap-4 mb-2">
            <div class="text-[40px] leading-none font-800 text-[#2E6F67]">{{ question.word }}</div>
            <div class="w-10 h-10 rounded-full bg-[#2E9885] text-white flex items-center justify-center">
              <i class="i-ph:speaker-high-bold text-[22px]"></i>
            </div>
          </div>
          <div class="text-center text-[#8E9BA7] mb-8">请选择正确的中文释义，时间超过10秒，建议选择不认识</div>

          <!-- 选项 -->
          <div class="grid grid-cols-2 gap-6 max-w-[860px] mx-auto">
            <button v-for="(op, idx) in question.options" :key="op.label" type="button" :class="toClasses(idx)" @click="choose(idx)">
              <span class="inline-flex items-center justify-center w-7 h-7 rounded-full border text-[14px]"
                    :class="selected===null ? 'text-[#2E9885] border-[#A0E0D4]' : (idx===question.answerIndex?'text-[#2E9885] border-[#2E9885]' : 'text-[#9AA3AF] border-[#D1D5DB]')">
                {{ op.label }}
              </span>
              <span>{{ op.text }}</span>
            </button>
          </div>

          <!-- 操作区 -->
          <div class="mt-10 flex items-center justify-center">
            <a-button shape="round" class="!h-12 !px-10 !rounded-full bg-[rgba(var(--primary-6),0.95)] !border-0 text-white hover:opacity-90" @click="notKnow">
              不认识
            </a-button>
          </div>

          <div v-if="selected!==null" class="mt-6 text-center" :class="isCorrect ? 'text-[#2E9885]' : 'text-[#D44A4A]'">
            {{ isCorrect ? '回答正确' : '回答错误' }}
          </div>
        </div>
      </div>

      <div class="mt-6 flex items-center justify-center">
        <a-button type="secondary" shape="round" class="!h-9 !px-6 !rounded-full" @click="backHome">返回首页</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
