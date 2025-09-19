<script setup lang="ts">
import { computed, ref } from 'vue'

type Book = {
  id: number
  name: string
  learned: number
  total: number
}

type SectionItem = {
  id: number
  type: 'review' | 'gate'
  title?: string
  date?: string
  today?: string
  color?: string
}

const books = ref<Book[]>([
  { id: 1, name: '外研版7年级上册', learned: 60, total: 730 },
  { id: 2, name: '新概念英语第一册', learned: 60, total: 730 },
  { id: 3, name: '人教版7年级上册', learned: 60, total: 730 },
  { id: 4, name: '人教版高中英语1-必修', learned: 60, total: 730 },
])

const activeBookId = ref(1)
const activeBook = computed(() => books.value.find(b => b.id === activeBookId.value)!)

// 章节数据（静态占位，后端接入时替换）
const sections = ref([
  {
    id: 1,
    label: '第一节',
    items: [
      { id: 11, type: 'review', title: '复习检测', date: '2025-09-06', today: '今日复习词数：0/92', color: '#3B82F6' },
      { id: 12, type: 'review', title: '复习检测', date: '2025-09-06', today: '今日复习词数：0/92', color: '#A855F7' },
      { id: 13, type: 'gate' },
    ] as SectionItem[],
  },
  {
    id: 2,
    label: '第二节',
    items: [
      { id: 21, type: 'review', title: '复习检测', date: '2025-09-06', today: '今日复习词数：0/92', color: '#3B82F6' },
      { id: 22, type: 'review', title: '复习检测', date: '2025-09-06', today: '今日复习词数：0/92', color: '#A855F7' },
      { id: 23, type: 'gate' },
    ] as SectionItem[],
  },
])

const selectBook = (id: number) => (activeBookId.value = id)
</script>

<template>
  <div class="p-6">
    <div class="text-[22px] font-700 text-[#1F2937] mb-4">复习词库</div>

    <div class="rounded-xl bg-[#F3F4F6] p-4">
      <div class="grid grid-cols-[280px_1fr] gap-6">
        <!-- 左侧：教材列表 -->
        <div class="rounded-xl bg-white p-4 border border-[#E5E7EB]">
          <div class="text-[#111827] text-[16px] font-700 mb-3">教材列表</div>

          <div class="flex flex-col gap-3">
            <button
              v-for="b in books"
              :key="b.id"
              type="button"
              class="text-left rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] border px-3 py-3 transition-all"
              :class="[
                b.id === activeBookId ? 'border-[#1AA287] ring-2 ring-[#CDF2EA]' : 'border-[#E5E7EB]'
              ]"
              @click="selectBook(b.id)"
            >
              <div class="text-[14px] font-600 text-[#1F2937] truncate">{{ b.name }}</div>
              <div class="mt-2 h-[1px] bg-[#E5E7EB] w-7" />
              <div class="mt-2 text-[12px] text-[#6B7280] flex items-center gap-5">
                <span>单词总数: {{ b.total }}</span>
                <span>已学习：{{ b.learned }}</span>
              </div>
            </button>
          </div>

          <div class="mt-6 rounded-lg bg-[#F3F4F6] h-40" />
        </div>

        <!-- 右侧：章节与卡片 -->
        <div class="flex flex-col gap-5">
          <div class="text-[#111827] text-[16px] font-700">{{ activeBook.name }}</div>

          <div v-for="sec in sections" :key="sec.id" class="space-y-3">
            <div class="inline-flex items-center">
              <span class="px-3 py-1 rounded-md text-[12px] text-white bg-[#1AA287]">{{ sec.label }}</span>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <template v-for="item in sec.items" :key="item.id">
                <!-- 复习卡片 -->
                <div
                  v-if="item.type === 'review'"
                  class="rounded-xl bg-white border border-[#E5E7EB] shadow-[0_4px_16px_rgba(2,6,23,0.06)] p-4 flex flex-col"
                >
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-md"
                         :style="{ backgroundColor: (item.color || '#CBD5E1') + '33' }" />
                    <div class="flex-1">
                      <div class="text-[16px] font-700 text-[#111827]">{{ item.title }}</div>
                      <div class="text-[12px] text-[#6B7280] mt-1">{{ item.date }}</div>
                    </div>
                  </div>
                  <div class="text-[12px] text-[#6B7280] mt-4">{{ item.today }}</div>

                  <div class="mt-4">
                    <a-button
                      long
                      shape="round"
                      class="h-10 text-[14px]"
                      :style="{ backgroundColor: item.color, color: '#fff', border: 'none' }"
                    >开始复习</a-button>
                  </div>
                </div>

                <!-- 词关卡片 -->
                <div
                  v-else
                  class="rounded-xl bg-white border border-[#E5E7EB] shadow-[0_4px_16px_rgba(2,6,23,0.06)] p-4 flex items-center justify-center text-[#374151] text-[14px]"
                >
                  单词闯关 <i class="i-ph:caret-right ml-1" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

