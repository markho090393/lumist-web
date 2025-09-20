<script setup lang="ts">
import { ref } from 'vue'
import StudyCatalogList, { type StudyCatalogItem } from './components/StudyCatalogList.vue'

const active = ref(0)
const courses = ref<StudyCatalogItem[]>([
  { title: '小学阅读', lines: ['共计章节：41', '已学：1'], progress: 2 },
  { title: '初中阅读', lines: ['共计章节：40', '已学：1'], progress: 10 },
  { title: '高中阅读', lines: ['共计章节：20', '已学：1'], progress: 25 },
])

type RecordItem = { section: string; desc: string; time: string }
const records = ref<RecordItem[]>([
  { section: '第01节', desc: '本节课供学习篇阅读', time: '2025-07-23 16:16:12' },
  { section: '第11节', desc: '本节课供学习篇阅读', time: '2025-07-23 16:16:12' },
  { section: '第41节', desc: '本节课供学习篇阅读', time: '2025-07-23 16:16:12' },
])
</script>

<template>
  <div class="p-6">
    <div class="text-[20px] font-700 text-[#2B2F36] mb-4">阅读复习</div>

    <div class="grid grid-cols-12 gap-6">
      <!-- 左：课程名称（复用通用组件） -->
      <div class="col-span-3">
        <StudyCatalogList title="课程名称" v-model:activeIndex="active" :items="courses" />
      </div>

      <!-- 右：学习记录 -->
      <div class="col-span-9">
        <div class="rounded-xl bg-[#F3F4F6] p-5">
          <div class="text-[16px] font-700 text-[#2B2F36] mb-4">学习记录</div>
          <div class="space-y-4">
            <div v-for="(r,i) in records" :key="i" class="rounded-lg bg-white px-4 py-3 flex items-center justify-between">
              <div class="w-24 text-[#334155]">{{ r.section }}</div>
              <div class="flex-1 text-[#475569]">{{ r.desc }}</div>
              <div class="w-52 text-[#94A3B8]">{{ r.time }}</div>
              <div class="flex items-center gap-3">
                <a-button shape="round" class="!h-8 !px-4 !rounded-full bg-[rgba(var(--primary-6),0.95)] text-white !border-0">查看</a-button>
                <a-button type="outline" shape="round" class="!h-8 !px-4 !rounded-full">查看报告</a-button>
              </div>
            </div>
          </div>
          <div class="h-96"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
