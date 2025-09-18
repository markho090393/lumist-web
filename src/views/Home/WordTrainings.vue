<script setup lang="ts">
import { ref, computed } from 'vue'
import WordPreviewModal from './components/WordPreviewModal.vue'
import WrittenOffModal from './components/WrittenOffModal.vue'

const bookTitle = '新概念英语第一册(新版)'
const total = ref(870)
const learned = ref(258)
const pending = computed(() => Math.max(total.value - learned.value, 0))

const previewVisible = ref(false)
const openPreview = () => (previewVisible.value = true)

const writtenOffVisible = ref(false)
const startLearning = () => {
  // 显示核销弹窗
  writtenOffVisible.value = true
}
</script>

<template>
  <div class="p-6">
    <!-- 顶部标题区 -->
    <div class="flex items-center gap-3 mb-6">
      <div class="text-[22px] font-700 text-[#2B2F36] leading-none">单词训练</div>
      <a-button type="outline" size="small" shape="round" class="!h-7 !px-3 !rounded-full !text-[#8E9BA7] !border-[#D7DDE4] !bg-white">拉通复习</a-button>
    </div>

    <!-- 词书卡片 -->
    <div class="w-[368px]">
      <div class="rounded-2xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
        <!-- 标题行 -->
          <div class="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[#EEF0F3]">
            <div class="text-[16px] font-600 text-[#2B2F36]">{{ bookTitle }}</div>
            <button class="text-[14px] text-[rgb(var(--primary-6))] hover:opacity-90" @click="openPreview">预览</button>
          </div>

        <!-- 中部统计 -->
        <div class="px-5 py-4 grid grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-full bg-[rgb(var(--primary-6))]" />
            <div>
              <div class="text-[12px] text-[#98A2B3] leading-none mb-1">单词统计</div>
              <div class="text-[20px] font-700 text-[rgb(var(--primary-6))]">{{ total }}个</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-14 h-14 rounded-full bg-[rgb(var(--primary-6))]" />
            <div>
              <div class="text-[12px] text-[#98A2B3] leading-none mb-1">已学习</div>
              <div class="text-[20px] font-700 text-[rgb(var(--primary-6))]">{{ learned }}个</div>
            </div>
          </div>
        </div>

        <!-- 底部操作区 -->
        <div class="px-5 pb-4 flex items-center justify-between">
          <div class="text-[18px] text-[#2B2F36]"><span class="font-700">{{ pending }}</span>个 <span class="text-[#98A2B3]">待学习</span></div>
          <a-button shape="round" class="!h-9 !px-4 !rounded-full bg-[rgba(var(--primary-6),0.12)] !border-0 text-[rgb(var(--primary-6))] hover:opacity-95" @click="startLearning">
            现在学习
          </a-button>
        </div>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <WordPreviewModal v-model="previewVisible" />
    
    <!-- 核销弹窗 -->
    <WrittenOffModal v-model="writtenOffVisible" />
  </div>
</template>
