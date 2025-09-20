<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import StudyCatalogList, { type StudyCatalogItem } from './components/StudyCatalogList.vue'

const active = ref(0)
const list = ref<StudyCatalogItem[]>([
  { title: '初中必背短语', lines: ['短语总数：549', '已学：12'] },
  { title: '小学考纲必会单词100练', lines: ['短语总数：21', '已学：20'] },
])

const currentTitle = computed(() => list.value[active.value]?.title || '')

const router = useRouter()
const goStats = () => router.push('/my-study/pass-stats')
const goPractice = () => router.push('/my-study/listen-word')
</script>

<template>
  <div class="p-6">
    <div class="text-[20px] font-700 text-[#2B2F36] mb-4">短语复习</div>

    <div class="grid grid-cols-12 gap-6">
      <!-- 左侧：教材列表 -->
      <div class="col-span-3">
        <StudyCatalogList title="教材列表" v-model:activeIndex="active" :items="list" />
      </div>

      <!-- 右侧：章节与卡片区 -->
      <div class="col-span-9">
        <div class="rounded-xl bg-[#F3F4F6] p-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="text-[16px] font-700 text-[#2B2F36]">{{ currentTitle }}</div>
            <span class="inline-flex items-center h-7 px-3 rounded-full bg-[#2E9885] text-white text-[12px]">第一节</span>
          </div>

          <div class="grid grid-cols-3 gap-5">
            <!-- 卡片1 -->
            <div class="rounded-xl bg-white p-4 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-[#E6E8FF]"></div>
                <div class="flex-1">
                  <div class="text-[16px] font-700 text-[#2B2F36]">复习检测</div>
                  <div class="text-[12px] text-[#94A3B8] mt-1">2025-09-06</div>
                </div>
              </div>
              <div class="mt-3 text-[13px] text-[#475569]">今日复习词数：0/92</div>
              <a-button long shape="round" class="!mt-4 !h-9 !rounded-full bg-[#3B82F6] text-white !border-0">开始练习</a-button>
            </div>

            <!-- 卡片2 -->
            <div class="rounded-xl bg-white p-4 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-[#F0E5FF]"></div>
                <div class="flex-1">
                  <div class="text-[16px] font-700 text-[#2B2F36]">复习检测</div>
                  <div class="text-[12px] text-[#94A3B8] mt-1">2025-09-06</div>
                </div>
              </div>
              <div class="mt-3 h-2 rounded bg-[#E5E7EB] overflow-hidden">
                <div class="h-full bg-[#8B5CF6] w-[40%]"></div>
              </div>
              <div class="mt-2 text-[13px] text-[#475569] flex items-center gap-6">
                <span>待打卡：16次</span>
                <span>已打卡：0次</span>
              </div>
              <a-button long shape="round" class="!mt-4 !h-9 !rounded-full bg-[#8B5CF6] text-white !border-0">开始练习</a-button>
            </div>

            <!-- 卡片3 -->
            <div class="rounded-xl bg-white p-4 shadow-sm">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-[#F3E8FF]"></div>
                <div class="flex-1">
                  <div class="text-[16px] font-700 text-[#2B2F36]">听音辨词</div>
                  <div class="text-[12px] text-[#94A3B8] mt-1">2025-09-06</div>
                </div>
              </div>
              <div class="mt-3 text-[13px] text-[#475569]">已闯关一次</div>
              <div class="mt-4 flex items-center gap-3">
                <a-button shape="round" class="!h-9 !px-5 !rounded-full bg-[#8B5CF6] text-white !border-0" @click="goPractice">开始练习</a-button>
                <a-button type="outline" shape="round" class="!h-9 !px-5 !rounded-full" @click="goStats">闯关统计</a-button>
              </div>
            </div>
          </div>

          <div class="h-80"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
