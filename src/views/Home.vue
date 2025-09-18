<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// 练习中心卡片数据
type PracticeCard = {
  label: string
  value: number
  icon: string // iconify 名称（UnoCSS presetIcons）
  gradient: string // 背景渐变类
}

const practiceCards: PracticeCard[] = [
  {
    label: '单词训练',
    value: 12000,
    icon: 'i-ph:book-open-duotone',
    gradient: 'bg-gradient-to-r from-[#7C64F8] to-[#A594FF]'
  },
  {
    label: '词汇量检测',
    value: 12000,
    icon: 'i-ph:lightbulb-duotone',
    gradient: 'bg-gradient-to-r from-[#27D3A7] to-[#5EE6CC]'
  },
  {
    label: '艾宾浩斯遗忘',
    value: 12000,
    icon: 'i-ph:check-square-offset-duotone',
    gradient: 'bg-gradient-to-r from-[#6F6BF9] to-[#7BB2FF]'
  },
  {
    label: '错词重记',
    value: 12000,
    icon: 'i-ph:seal-warning-duotone',
    gradient: 'bg-gradient-to-r from-[#4BA0FF] to-[#6AB4FF]'
  },
]

// 快速练习数据
type QuickItem = {
  label: string
  colorFrom: string
  colorTo: string
  emphasize?: boolean // 是否边框强调
}
const quickList: QuickItem[] = [
  { label: '音标练习', colorFrom: '#F7D7A2', colorTo: '#FAE9C8' },
  { label: '短语练习', colorFrom: '#CDEBFF', colorTo: '#E1F3FF', emphasize: true },
  { label: '语法练习', colorFrom: '#FFC9B3', colorTo: '#FFD8C8' },
  { label: '阅读练习', colorFrom: '#D0EAF7', colorTo: '#E3F4FA' },
]

// 仪表盘相关（简洁 SVG 实现）
type Sector = { start: number; end: number; color: string; label: string }
const sectors: Sector[] = [
  { start: -180, end: -144, color: 'rgba(var(--primary-6), 0.95)', label: 'E' },
  { start: -144, end: -108, color: 'rgba(var(--primary-6), 0.85)', label: 'D' },
  { start: -108, end: -72, color: 'rgba(var(--primary-6), 0.75)', label: 'C' },
  { start: -72, end: -36, color: 'rgba(var(--primary-6), 0.65)', label: 'B' },
  { start: -36, end: 0, color: 'rgba(var(--primary-6), 0.55)', label: 'A' },
]

const polar = (angleDeg: number, r: number) => {
  const a = (Math.PI / 180) * angleDeg
  return { x: 100 + r * Math.cos(a), y: 120 + r * Math.sin(a) }
}

const makePath = (s: number, e: number, rOuter: number, rInner: number) => {
  const p1 = polar(s, rOuter)
  const p2 = polar(e, rOuter)
  const p3 = polar(e, rInner)
  const p4 = polar(s, rInner)
  const large = e - s > 180 ? 1 : 0
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ')
}

const letterPositions = computed(() =>
  sectors.map((s) => {
    const mid = (s.start + s.end) / 2
    const p = polar(mid, 78)
    return { ...s, x: p.x, y: p.y }
  }),
)

const grade = 'A'
const learned = 81
const notLearned = 321

const router = useRouter()
const onPracticeCardClick = (label: string, idx: number) => {
  // 仅“单词训练”跳转子路由，其余保留
  if (label === '单词训练' || idx === 0) {
    router.push('/home/word-training')
  }
}
</script>

<template>
  <div class="p-6">
    <div class="grid grid-cols-3 gap-6">
      <!-- 左侧主列 -->
      <div class="col-span-2 space-y-6">
        <!-- 练习中心 -->
        <section>
          <h2 class="text-[16px] font-600 text-[#2B2F36] mb-4">练习中心</h2>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(item, idx) in practiceCards"
              :key="idx"
              class="rounded-3xl h-36 p-6 text-white relative overflow-hidden shadow-sm"
              :class="[item.gradient, idx === 0 ? 'cursor-pointer hover:shadow-md transition-shadow' : '']"
              @click="onPracticeCardClick(item.label, idx)"
            >
              <div class="flex flex-col h-full justify-between">
                <div class="text-[28px] font-700 leading-none">{{ item.value }}</div>
                <div class="text-[14px] opacity-90">{{ item.label }}</div>
              </div>
              <div
                class="absolute right-4 top-4 w-12 h-12 rounded-2xl bg-white/80 text-[rgb(var(--primary-6))] flex items-center justify-center shadow"
              >
                <i :class="item.icon + ' text-20'" />
              </div>
            </div>
          </div>
        </section>

        <!-- 快速练习 -->
        <section>
          <h2 class="text-[16px] font-600 text-[#2B2F36] mb-4">快速练习</h2>
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(q, i) in quickList"
              :key="q.label"
              class="relative overflow-hidden rounded-3xl h-28 p-6 flex items-center text-[#247] shadow-sm"
              :style="{
                background: `linear-gradient(90deg, ${q.colorFrom} 0%, ${q.colorTo} 100%)`,
                border: q.emphasize ? '3px solid #57B0FF' : 'none',
              }"
            >
              <span class="text-[18px] font-700 tracking-wide" :class="i % 2 ? 'text-[#2680C2]' : 'text-[#F57C00]'">
                {{ q.label }}
              </span>

              <!-- 背景圆纹理 -->
              <div class="absolute -left-10 bottom-[-20px] w-40 h-40 rounded-full bg-white/30" />
              <div class="absolute left-20 -bottom-8 w-24 h-24 rounded-full bg-white/25" />
              <div class="absolute right-6 -top-8 w-28 h-28 rounded-full bg-white/20" />
            </div>

            <!-- 口语练习（跨两列） -->
            <div
              class="relative overflow-hidden rounded-3xl h-28 p-6 flex items-center col-span-2 shadow-sm"
              :style="{
                background: 'linear-gradient(90deg, #CFF4E6 0%, #DFF8EE 100%)',
              }"
            >
              <span class="text-[18px] font-700 text-[#17A271] tracking-wide">口语练习</span>
              <div class="absolute -left-6 top-2 w-36 h-36 rounded-full bg-white/30" />
              <div class="absolute left-28 -bottom-6 w-28 h-28 rounded-full bg-white/25" />
              <div class="absolute right-10 -top-10 w-40 h-40 rounded-full bg-white/20" />
            </div>
          </div>
        </section>
      </div>

      <!-- 右侧侧栏 -->
      <div class="col-span-1 space-y-6">
        <!-- 个人信息卡片 -->
        <section class="bg-white rounded-3xl p-6 shadow-sm">
          <div class="flex items-center justify-center">
            <div class="w-[72px] h-[72px] rounded-full overflow-hidden bg-[#EAF3FF] flex items-center justify-center">
              <i class="i-ph:user-duotone text-[24px] text-[rgb(var(--primary-6))]" />
            </div>
          </div>
          <div class="text-center mt-4">
            <div class="text-[16px] font-600 text-[#2B2F36]">小鹿还能学</div>
            <div class="text-[12px] text-[#7B8794] mt-1">江苏大学</div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="text-center">
              <div class="text-[12px] text-[#7B8794]">可用课时</div>
              <div class="text-[24px] font-700 text-[#2B2F36]">799</div>
            </div>
            <div class="text-center">
              <div class="text-[12px] text-[#7B8794]">已用课时</div>
              <div class="text-[24px] font-700 text-[#2B2F36]">141</div>
            </div>
          </div>
        </section>

        <!-- 学习进度个性化报告 -->
        <section class="bg-white rounded-3xl p-6 shadow-sm">
          <div class="text-[14px] font-600 text-[#2B2F36] mb-4">学习进度个性化报告</div>
          <div class="flex items-center justify-center">
            <svg viewBox="0 0 200 140" class="w-[320px] h-[208px]">
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.15" />
                </filter>
              </defs>

              <g filter="url(#shadow)">
                <template v-for="s in sectors" :key="s.start">
                  <path :d="makePath(s.start, s.end, 90, 60)" :fill="s.color" />
                </template>
              </g>

              <!-- 字母标签 -->
              <template v-for="p in letterPositions" :key="p.label">
                <text :x="p.x" :y="p.y" text-anchor="middle" class="fill-white" style="font-size:12px; font-weight:700">{{ p.label }}</text>
              </template>

              <!-- 指针 -->
              <g transform="translate(100,120)">
                <polygon points="0,-50 7,-35 -7,-35" fill="#F04438" />
              </g>

              <!-- 中心等级 -->
              <circle cx="100" cy="120" r="34" fill="#fff" />
              <text x="100" y="118" text-anchor="middle" style="font-size:26px; font-weight:800" class="fill-[#124B40]">{{ grade }}</text>
              <text x="100" y="136" text-anchor="middle" style="font-size:12px" class="fill-[#7B8794]">等级评定</text>
            </svg>
          </div>

          <div class="grid grid-cols-2 mt-4">
            <div class="text-center">
              <div class="text-[12px] text-[#7B8794]">未学</div>
              <div class="text-[20px] font-700 text-[#2B2F36]">{{ notLearned }}</div>
            </div>
            <div class="text-center">
              <div class="text-[12px] text-[#7B8794]">已学</div>
              <div class="text-[20px] font-700 text-[#2B2F36]">{{ learned }}</div>
            </div>
          </div>

          <div class="mt-4 text-[12px] text-[#98A2B3] leading-6">
            <div class="flex items-center gap-1">
              <i class="i-carbon:locked text-[#98A2B3]" />
              <span>说明</span>
            </div>
            <div>
              评定等级根据学习情况和出勤情况的综合评定定为 A、B、C、D、E 五个等级，其中 A 等级为优秀，B 等级为优，C 等级为良，D 等级为差，E 等级为差。
            </div>
            <div class="text-[10px] text-[#C4CDD5] mt-2">* 评定数据仅供参考，对结果不承担法律责任。</div>
          </div>
        </section>
      </div>
    </div>

  </div>
</template>
