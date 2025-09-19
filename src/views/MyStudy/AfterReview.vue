<script setup lang="ts">
import { computed } from 'vue'

type ReviewBlock = {
  title: string
  desc: string
  count: number
  sub: string
  btnText: string
}


// 设计稿数据（占位，后续可接入接口）
const blocks: ReviewBlock[] = [
  {
    title: '复习词库',
    desc: '智能算法，科学记忆',
    count: 490,
    sub: '待复习单词',
    btnText: '开始复习',
  },
  {
    title: '巩固复习库',
    desc: '定期复习，强化记忆',
    count: 0,
    sub: '今日单词',
    btnText: '开始复习',
  },
  {
    title: '已学单词库',
    desc: '查看进度，巩固所学',
    count: 0,
    sub: '掌握单词',
    btnText: '查看详情',
  },
]

const gapCls = computed(() => 'gap-6')

const goto = (_?: unknown) => {}
</script>

<template>
  <div class="px-6 py-4">
    <div class="text-[22px] font-700 text-[#1F2937] mb-4">课后复习</div>

    <div class="grid grid-cols-3" :class="gapCls">
      <div
        v-for="b in blocks"
        :key="b.title"
        class="rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] border border-[#E5E7EB] py-4 px-5"
      >
        <!-- 头部：图标 + 标题描述 -->
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-md bg-[#2AA39A]" />
          <div class="flex-1">
            <div class="text-[16px] font-700 text-[#111827]">{{ b.title }}</div>
            <div class="text-[12px] text-[#7C8794] mt-1">{{ b.desc }}</div>
          </div>
        </div>

        <!-- 底部：计数 + 按钮 -->
        <div class="flex items-center justify-between mt-6">
          <div>
            <div class="text-[36px] leading-[40px] font-700 text-[#111827]">{{ b.count }}</div>
            <div class="text-[12px] text-[#7C8794] mt-1">{{ b.sub }}</div>
          </div>

          <a-button
            shape="round"
            size="large"
            class="min-w-[112px] h-10 text-[14px]"
            type="outline"
            style="--color-border: #15A38B; color: #0F766E; border-color: #15A38B;"
            @click="goto('noop')"
          >
            {{ b.btnText }}
          </a-button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
</style>
