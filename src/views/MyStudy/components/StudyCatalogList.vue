<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// 通用“学习目录列表”组件：用于教材/课程列表等的数据驱动展示
export type StudyCatalogItem = {
  id?: string | number
  title: string
  // 底部信息行，如：['共计章节：41', '已学：1']
  lines?: string[]
  // 0-100（可选）
  progress?: number
  // 是否不可选
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  title?: string
  items: StudyCatalogItem[]
  activeIndex: number
  // 主题色，默认与站点主绿一致
  highlightColor?: string
  // 是否显示进度条（当 item.progress 存在时）
  showProgress?: boolean
}>(), {
  highlightColor: '#2E9885',
  showProgress: true,
})

const emit = defineEmits<{
  (e: 'update:activeIndex', v: number): void
  (e: 'select', payload: { item: StudyCatalogItem; index: number }): void
}>()

const onPick = (i: number) => {
  const item = props.items[i]
  if (item?.disabled) return
  emit('update:activeIndex', i)
  emit('select', { item, index: i })
}
</script>

<template>
  <div class="rounded-xl bg-white p-4 shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
    <div v-if="title" class="text-[16px] font-700 text-[#2B2F36] mb-4">{{ title }}</div>
    <div class="space-y-3">
      <button
        v-for="(m,i) in items"
        :key="m.id ?? i"
        type="button"
        class="w-full text-left rounded-lg px-4 py-3 bg-[#F6F7F9] border transition-all duration-150"
        :class="[ i===activeIndex ? '' : 'border-transparent hover:border-[#E5E7EB]', m.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer' ]"
        :style="i===activeIndex ? { borderColor: highlightColor, outline: `4px solid ${highlightColor}1A` } : undefined"
        @click="onPick(i)"
      >
        <!-- 自定义项插槽：如需完全自绘，可透传 item/index/active -->
        <slot name="item" :item="m" :index="i" :active="i===activeIndex">
          <div class="flex items-center justify-between">
            <div class="text-[#2B2F36] font-600">{{ m.title }}</div>
            <div v-if="typeof m.progress === 'number'" class="text-[#475569] text-[12px]">{{ m.progress }}%</div>
          </div>
          <div v-if="showProgress && m.progress !== undefined" class="mt-2 h-2 rounded bg-[#E5E7EB] overflow-hidden">
            <div class="h-full" :style="{ width: `${m.progress}%`, backgroundColor: highlightColor }"></div>
          </div>
          <div v-if="m.lines?.length" class="mt-2 text-[13px] text-[#64748B] flex items-center gap-6">
            <span v-for="(t,idx) in m.lines" :key="idx">{{ t }}</span>
          </div>
        </slot>
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
