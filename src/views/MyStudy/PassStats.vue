<script setup lang="ts">
import { computed, reactive, ref, h } from 'vue'

type Row = {
  id: number
  en: string
  times: number
  ipa: string
  meaning: string
  strong: boolean
}

const activeTab = ref<'known' | 'unknown'>('known')

const rows = reactive<Row[]>([
  { id: 1, en: 'excuse', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'n. 借口；致歉；v. 宽恕；原谅', strong: true },
  { id: 2, en: 'me', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'pron. 我（宾格）', strong: true },
  { id: 3, en: 'yes', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'adv. 是；n. 是', strong: true },
  { id: 4, en: 'is', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'v. 是', strong: false },
  { id: 5, en: 'this', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'adj. 这；pron. 这个；adv. 这样', strong: false },
  { id: 6, en: 'your', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'pron. 你的；你们的', strong: false },
  { id: 7, en: 'handbag', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'n. 手提包', strong: false },
  { id: 8, en: 'pardon', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'v. 原谅；n. 宽恕', strong: false },
  { id: 9, en: 'it', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'pron. 它', strong: true },
  { id: 10, en: 'thank you', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'phrase. 谢谢你', strong: false },
  { id: 11, en: 'very much', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'phrase. 很；非常', strong: false },
  { id: 12, en: 'pen', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'n. 钢笔；围栏', strong: false },
  { id: 13, en: 'pencil', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'n. 铅笔', strong: false },
  { id: 14, en: 'book', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'n. 书；v. 预定', strong: false },
  { id: 15, en: 'watch', times: 1, ipa: "/'tʃɪkɪn/", meaning: 'v. 观看；n. 手表；监视；注意', strong: false },
])

const selectAll = ref(false)
const selectedCount = computed(() => rows.filter(r => r.strong).length)

const toggleAll = () => {
  rows.forEach(r => (r.strong = selectAll.value))
}

const startTraining = () => {
  // 后续接入强化训练路由
}

type Col = { title: any; dataIndex?: string; width?: number; align?: 'left'|'center'|'right'; slotName?: string }
const columns = computed<Col[]>(() => [
  { title: '英文', dataIndex: 'en', width: 180 },
  { title: '闯关次数', dataIndex: 'times', width: 120 },
  { title: '音标', dataIndex: 'ipa', width: 160, slotName: 'ipa' },
  { title: '释义', dataIndex: 'meaning', slotName: 'meaning' },
  {
    title: h(
      'div',
      { class: 'flex items-center justify-end gap-2 text-[#475569]' },
      [
        h('span', '是否强化训练'),
        h('input', {
          type: 'checkbox',
          checked: selectAll.value,
          onChange: (e: any) => {
            selectAll.value = e.target.checked
            toggleAll()
          },
          style: 'accent-color:#2E9885;',
        }),
        h('span', '全部'),
      ],
    ),
    dataIndex: 'strong',
    width: 180,
    align: 'center',
    slotName: 'strong',
  },
])
</script>

<template>
  <div class="p-6">
    <div class="text-[20px] font-700 text-[#2B2F36] mb-4">闯关统计</div>

    <div class="flex items-center gap-6 text-[14px] mb-4">
      <button type="button" class="pb-1" :class="activeTab==='unknown' ? 'text-[#2E9885] border-b-2 border-[#2E9885]' : 'text-[#64748B]'" @click="activeTab='unknown'">
        闯关不会（0）
      </button>
      <button type="button" class="pb-1" :class="activeTab==='known' ? 'text-[#2E9885] border-b-2 border-[#2E9885]' : 'text-[#64748B]'" @click="activeTab='known'">
        闯关会的（{{ rows.length }}）
      </button>
    </div>

    <div class="rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
      <div class="p-0">
        <a-table class="spell-stats-table" :data="rows" :columns="columns" :pagination="false">
          <template #ipa="{ record }">
            <div class="flex items-center gap-2">
              <i class="i-ph:speaker-high-bold text-[#2E6F67]"></i>
              <span class="text-[#64748B]">{{ record.ipa }}</span>
            </div>
          </template>
          <template #meaning="{ record }">
            <span class="text-[#475569]">{{ record.meaning }}</span>
          </template>
          <template #strong="{ record }">
            <input type="checkbox" v-model="record.strong" style="accent-color: #2E9885;" />
          </template>
        </a-table>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="text-[#64748B]">已选择 {{ selectedCount }} 个</div>
      <a-button shape="round" class="!h-10 !px-6 !rounded-full bg-[rgba(var(--primary-6),0.95)] !border-0 text-white hover:opacity-90" @click="startTraining">
        提交并开始强化训练
      </a-button>
    </div>
  </div>
</template>

<style scoped>
:deep(.spell-stats-table .arco-table-th) {
  background-color: #fff;
}
:deep(.spell-stats-table .arco-table-td),
:deep(.spell-stats-table .arco-table-th) {
  padding-top: 14px;
  padding-bottom: 14px;
}
:deep(.spell-stats-table .arco-table-td),
:deep(.spell-stats-table .arco-table-th) {
  border-left: none !important;
  border-right: none !important;
}
:deep(.spell-stats-table .arco-table-container),
:deep(.spell-stats-table .arco-table-content table) {
  border-left: none !important;
  border-right: none !important;
}
</style>

