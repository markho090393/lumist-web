<script setup lang="ts">
import { computed } from 'vue'

type Row = { no: number; en: string; zh: string }

// v-model 控制可见性
const visible = defineModel<boolean>({ default: false })

// 允许父组件透传数据，提供合理默认值用于演示
const props = withDefaults(defineProps<{
  rows?: Row[]
  total?: number
  current?: number
  pageSize?: number
  highlightIndex?: number // 高亮行（1-based）
}>(), {
  rows: () => [
    { no: 1, en: 'excuse', zh: 'n. 饶恕；借口；致歉；v. 原谅；辩解' },
    { no: 2, en: 'me', zh: 'pron. 我（宾语）' },
    { no: 3, en: 'yes', zh: 'adv. 是；n. 是' },
    { no: 4, en: 'is', zh: 'v. 是' },
    { no: 5, en: 'this', zh: 'adj. 这；pron. 这个；adv. 这样；这么' },
    { no: 6, en: 'your', zh: 'pron. 你的；你们的' },
    { no: 7, en: 'handbag', zh: 'n. 手提包' },
    { no: 8, en: 'pardon', zh: 'v. 原谅；宽恕；请再说一遍；n. 原谅；宽恕' },
    { no: 9, en: 'it', zh: 'pron. 它' },
    { no: 10, en: 'thank you', zh: 'phrase. 谢谢你' },
    { no: 11, en: 'very much', zh: 'phrase. 很；非常' },
    { no: 12, en: 'pen', zh: 'n. 钢笔；笔；围栏' },
    { no: 13, en: 'pencil', zh: 'n. 铅笔' },
    { no: 14, en: 'book', zh: 'n. 书；账簿；v. 预定' },
    { no: 15, en: 'watch', zh: 'v. 观看；观察；小心；n. 手表；监视' },
  ],
  total: 870,
  current: 1,
  pageSize: 15,
  highlightIndex: 9,
})

const columns = [
  { title: '序号', dataIndex: 'no', width: 80 },
  { title: '英文', dataIndex: 'en', width: 240 },
  { title: '中文', dataIndex: 'zh' },
]

const current = computed({
  get: () => props.current,
  set: () => {},
})

const pageSize = computed({
  get: () => props.pageSize,
  set: () => {},
})

const rowClassName = (_record: Row, rowIndex: number) =>
  rowIndex + 1 === props.highlightIndex ? 'bg-[#F3F4F6]' : ''

const close = () => (visible.value = false)
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :width="864"
    :footer="false"
    :mask-closable="true"
    :render-to-body="false"
    :body-style="{ padding: '16px 20px 20px 20px' }"
    :modal-style="{ borderRadius: '16px' }"
    @cancel="close"
  >
    <template #title>
      <div class="text-[22px] font-600 text-[#2B2F36]">单词预览</div>
    </template>

    <a-table
      :columns="columns"
      :data="rows"
      :pagination="false"
      :stripe="false"
      :bordered="false"
      :row-class-name="rowClassName"
    />

    <div class="mt-4 flex items-center gap-2">
      <a-pagination
        :total="total"
        :current="current"
        :page-size="pageSize"
        show-total
        show-jumper
        size-can-change
      />
    </div>
  </a-modal>
</template>

<style scoped>
/* 标题与圆角更贴近设计稿 */
:deep(.arco-modal-header) {
  padding: 16px 20px 8px 20px;
}

/* 表头与行高调优 */
:deep(.arco-table-th) {
  background: #ffffff;
  font-weight: 600;
  color: #2b2f36;
  height: 44px;
}
:deep(.arco-table-td) {
  height: 44px;
}

/* 去掉 hover 强对比，突出高亮行 */
:deep(.arco-table-tr:hover) > td {
  background: transparent;
}
</style>
