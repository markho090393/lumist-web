<script setup lang="ts">
import { ref } from 'vue'

type Metric = { icon: string; label: string; value: string; sub?: string }
const metrics = ref<Metric[]>([
  { icon: 'i-ph:flame text-[#F97316]', label: '累计学习', value: '已坚持学习90天' },
  { icon: 'i-ph:clock text-[#10B981]', label: '今日学习时长', value: '60分钟' },
  { icon: 'i-ph:bookmark-simple text-[#22C55E]', label: '抗遗忘打卡', value: '54次' },
  { icon: 'i-ph:book-open-text text-[#06B6D4]', label: '已学单词', value: '2215个' },
])

type Card = {
  title: string
  desc: string
  color: string // 主色
  btnText: string
  badgeRight?: string
  subline?: string
}

const studyCards = ref<Card[]>([
  {
    title: '单词复习',
    desc: '巩固记忆，提升保持率',
    color: '#8B5CF6',
    btnText: '开始复习',
    subline: '今日复习词数：0/92',
    badgeRight: '0%'
  },
  {
    title: '短语复习',
    desc: '聚焦短语，强化记忆',
    color: '#22C55E',
    btnText: '前往复习',
    subline: '今日需复习：0/0',
  },
  {
    title: '词汇量检测',
    desc: '准确评估，查看进步',
    color: '#3B82F6',
    btnText: '开始测试',
    subline: '上次测试：今天',
    badgeRight: '上次：0词',
  },
  {
    title: '音标训练',
    desc: '标准发音，提升口语',
    color: '#F97316',
    btnText: '开始练习',
  },
  {
    title: '口语',
    desc: '情景记忆，活学活用',
    color: '#EF4444',
    btnText: '开始学习',
  },
  {
    title: '语法复习',
    desc: '系统掌握，查漏补缺',
    color: '#14B8A6',
    btnText: '开始学习',
  },
  {
    title: '阅读复习',
    desc: '巩固词汇语法，提升理解能力',
    color: '#F59E0B',
    btnText: '开始学习',
  },
])

const colorAlpha = (hex: string, alpha: number) => {
  const m = hex.replace('#', '')
  const bigint = parseInt(m, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
</script>

<template>
  <div class="p-6">
    <div class="text-[22px] font-700 text-[#2B2F36] mb-4">我的学习</div>

    <!-- 顶部统计 -->
    <div class="rounded-2xl bg-white p-5 shadow-[0_6px_24px_rgba(2,6,23,0.06)] mb-6">
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(m, i) in metrics"
          :key="i"
          class="rounded-xl bg-[#F6F7F9] px-4 py-3 flex items-center gap-3"
        >
          <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <i :class="[m.icon, 'text-[22px]']" />
          </div>
          <div class="flex-1">
            <div class="text-[12px] text-[#8E9BA7]">{{ m.label }}</div>
            <div class="text-[18px] font-700 text-[#2B2F36] leading-6">{{ m.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习模块卡片 -->
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="(c, i) in studyCards"
        :key="i"
        class="rounded-2xl p-0 bg-white border shadow-[0_6px_24px_rgba(2,6,23,0.06)] overflow-hidden h-52 flex flex-col"
        :style="{ borderColor: colorAlpha(c.color, 0.5) }"
      >
        <div class="p-5 relative flex flex-col h-full" :style="{ background: `linear-gradient(180deg, ${colorAlpha(c.color,0.08)} 0%, transparent 60%)` }">
          <div class="absolute right-4 top-3 text-[13px] text-[#6366F1]" v-if="c.badgeRight">{{ c.badgeRight }}</div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg" :style="{ backgroundColor: colorAlpha(c.color, 0.8) }"></div>
            <div>
              <div class="text-[18px] font-700" :style="{ color: '#2B2F36' }">{{ c.title }}</div>
              <div class="text-[13px] text-[#8E9BA7] mt-1">{{ c.desc }}</div>
            </div>
          </div>
          <div class="text-[13px] text-[#475569] mt-6" v-if="c.subline">{{ c.subline }}</div>
          <div class="mt-auto pt-4">
            <a-button
              long
              shape="round"
              :style="{ backgroundColor: colorAlpha(c.color, 0.95), color: '#fff', border: 'none', height: '40px' }"
            >{{ c.btnText }}</a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
