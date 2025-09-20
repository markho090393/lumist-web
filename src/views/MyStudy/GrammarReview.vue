<script setup lang="ts">
import { ref, computed } from 'vue'
import StudyCatalogList, { type StudyCatalogItem } from './components/StudyCatalogList.vue'

const active = ref(0)
const items = ref<StudyCatalogItem[]>([
  { title: '初中语法', lines: ['共计章节：41', '已学：1'], progress: 2 },
  { title: '高中语法', lines: ['共计章节：40', '已学：1'], progress: 10 },
  { title: '小学语法', lines: ['共计章节：20', '已学：1'], progress: 25 },
])
const currentTitle = computed(() => items.value[active.value]?.title || '')
</script>

<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="text-[20px] font-700 text-[#2B2F36]">语法复习</div>
      <a-button shape="round" class="!h-9 !px-6 !rounded-full bg-[rgba(var(--primary-6),0.95)] !border-0 text-white hover:opacity-90">错题本</a-button>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <!-- 左侧：教材列表 -->
      <div class="col-span-3">
        <StudyCatalogList title="教材列表" v-model:activeIndex="active" :items="items" />
      </div>

      <!-- 右侧：章节列表 -->
      <div class="col-span-9">
        <div class="rounded-xl bg-[#F3F4F6] p-5">
          <div class="text-[16px] font-700 text-[#2B2F36] mb-4">{{ currentTitle }}</div>

          <div class="rounded-xl bg-white p-4 shadow-sm flex items-center justify-between">
            <div class="text-[#475569]">第一节 名次的分类，可数名词<span class="ml-4 text-[#94A3B8]">2025-07-23 16:16:12</span></div>
            <div class="flex items-center gap-3">
              <a-button type="outline" shape="round" class="!h-8 !px-4 !rounded-full">课后复习</a-button>
              <a-button type="outline" shape="round" class="!h-8 !px-4 !rounded-full">复习刷题</a-button>
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
