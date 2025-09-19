<script setup lang="ts">
import { ref } from 'vue'

// 剪纸盒弹窗（设计稿 1:1 还原）
// - Arco Modal + UnoCSS
// - v-model 控制可见性
// - 右侧为“剪刀”操作按钮

const visible = defineModel<boolean>({ default: false })

const props = withDefaults(
  defineProps<{
    words?: string[]
  }>(),
  {
    words: () => ['cloud', 'sky', 'sun', 'shine', 'shine'],
  },
)

const cutCount = ref(0)
const emit = defineEmits<{
  (e: 'cut', payload: { index: number; word: string }): void
  (e: 'spell', payload: { index: number; word: string }): void
  (e: 'expand', payload: { index: number; word: string }): void
}>()

const onCut = (idx: number, w: string) => {
  cutCount.value += 1
  emit('cut', { index: idx, word: w })
}
const onSpell = (idx: number, w: string) => emit('spell', { index: idx, word: w })
const onExpand = (idx: number, w: string) => emit('expand', { index: idx, word: w })

const close = () => (visible.value = false)
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :width="920"
    :footer="false"
    title="剪纸盒"
    title-align="start"
    :mask-closable="true"
    :render-to-body="false"
    :body-style="{ padding: '16px 20px 20px 20px', maxHeight: 'calc(100vh * 5 / 7)', overflowY: 'auto' }"
    :modal-style="{ borderRadius: '16px', backgroundColor: '#F3F3F3' }"
    @cancel="close"
  >
    <div class="text-[#8E9BA7] text-[13px] mb-4">点击裁剪按钮即可完成裁剪</div>

    <div class="space-y-4">
      <div
        v-for="(w, idx) in props.words"
        :key="idx"
        class="grid grid-cols-[1fr_auto] gap-4 items-center"
      >
        <!-- 左侧单词卡片 -->
        <div class="rounded-2xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] h-20 px-6 flex items-center justify-between border border-[#E5E7EB]/80">
          <div class="text-[26px] font-600 text-[#2B2F36] leading-none" :class="idx===2 ? 'italic font-700' : ''">{{ w }}</div>
          <div class="flex items-center gap-8 text-[14px]">
            <button class="text-[rgb(var(--success-6))] hover:opacity-80" @click="onSpell(idx, w)">拼读</button>
            <button class="text-[rgb(var(--success-6))] hover:opacity-80" @click="onExpand(idx, w)">拓展</button>
          </div>
        </div>

        <!-- 右侧剪刀按钮 -->
        <button
          class="w-14 h-14 rounded-xl bg-[#2F8C7C] flex items-center justify-center hover:opacity-90 active:opacity-95 text-white"
          @click="onCut(idx, w)"
          aria-label="裁剪"
        >
          <!-- 提供的剪刀 SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 60 60" fill="none">
            <path d="M35.2953 30L41.0879 35.7925C43.2244 34.8865 45.6096 34.7519 47.8346 35.4116C50.0596 36.0713 51.9858 37.4844 53.2832 39.4086C54.5806 41.3328 55.1683 43.6483 54.9457 45.9584C54.723 48.2684 53.7039 50.4291 52.0629 52.0701C50.4219 53.7111 48.2612 54.7302 45.9512 54.9529C43.6412 55.1755 41.3256 54.5878 39.4014 53.2904C37.4772 51.993 36.0641 50.0668 35.4044 47.8418C34.7447 45.6168 34.8793 43.2316 35.7854 41.095L29.9929 35.3025L15.8229 49.475C14.8852 50.4124 13.6137 50.939 12.2879 50.939C10.962 50.939 9.69049 50.4124 8.75285 49.475L6.98535 47.705L24.6879 30L6.98535 12.2975L8.75285 10.5275C9.69049 9.59018 10.962 9.06361 12.2878 9.06361C13.6137 9.06361 14.8852 9.59018 15.8228 10.5275L29.9929 24.6975L35.7828 18.905C34.8768 16.7685 34.7422 14.3833 35.4019 12.1583C36.0616 9.93332 37.4747 8.00707 39.3989 6.70968C41.3231 5.41229 43.6386 4.82455 45.9487 5.0472C48.2587 5.26984 50.4194 6.289 52.0604 7.93C53.7014 9.57101 54.7205 11.7317 54.9432 14.0417C55.1658 16.3517 54.5781 18.6673 53.2807 20.5915C51.9833 22.5157 50.0571 23.9288 47.8321 24.5885C45.6071 25.2482 43.2219 25.1135 41.0853 24.2075L35.2978 30L35.2953 30ZM49.9929 45C49.9929 44.3434 49.8635 43.6932 49.6122 43.0866C49.361 42.48 48.9927 41.9288 48.5284 41.4645C48.0641 41.0002 47.5129 40.6319 46.9063 40.3806C46.2996 40.1294 45.6495 40 44.9929 40C44.3362 40 43.6861 40.1294 43.0794 40.3806C42.4728 40.6319 41.9216 41.0002 41.4573 41.4645C40.993 41.9288 40.6247 42.48 40.3735 43.0866C40.1222 43.6933 39.9929 44.3434 39.9929 45C39.9929 46.3261 40.5196 47.5979 41.4573 48.5356C42.395 49.4733 43.6668 50 44.9929 50C46.3189 50 47.5907 49.4733 48.5284 48.5356C49.4661 47.5979 49.9928 46.3261 49.9929 45ZM49.9928 15C49.9928 14.3434 49.8635 13.6932 49.6122 13.0866C49.361 12.48 48.9927 11.9288 48.5284 11.4645C48.0641 11.0002 47.5129 10.6319 46.9063 10.3806C46.2996 10.1294 45.6495 10 44.9928 10C44.3362 10 43.6861 10.1294 43.0794 10.3806C42.4728 10.6319 41.9216 11.0002 41.4573 11.4645C40.993 11.9288 40.6247 12.48 40.3735 13.0866C40.1222 13.6932 39.9928 14.3434 39.9928 15C39.9928 16.3261 40.5196 17.5979 41.4573 18.5356C42.395 19.4733 43.6668 20 44.9928 20C46.3189 20 47.5907 19.4733 48.5284 18.5356C49.4661 17.5979 49.9928 16.3261 49.9928 15Z" fill="white" />
          </svg>
        </button>
      </div>

      <!-- 底部纸盒图标与计数 -->
      <div class="mt-8 flex items-center justify-center relative">
        <div class="relative w-[209px] h-[124px]">
          <div class="absolute left-1/2 -translate-x-1/2 -top-1 text-white text-[22px] font-700 select-none">{{ cutCount }}</div>
          <svg width="209" height="124" viewBox="0 0 209 124" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M105.082 123.429V45.8779L172.939 23L173.714 91.2453L105.082 123.429Z" fill="#86B8F6"/>
            <path d="M105.47 123.816L36.8369 92.0204L37.6124 21.449L105.082 45.8775L105.47 123.816Z" fill="#B5D6FF"/>
            <path d="M37.6122 21.449L12.7959 35.0204L24.0408 33.4694L37.6122 21.449Z" fill="#3F74B4"/>
            <path d="M104.694 4L37.6123 21.449L105.082 45.8776L104.694 4Z" fill="#98C3FA"/>
            <path d="M105.082 45.8776L104.694 4L172.939 23L105.082 45.8776Z" fill="#BDDAFF"/>
            <path d="M104.507 11.248C107.363 11.248 109.573 12.438 111.137 14.852C112.565 17.096 113.279 20.088 113.279 23.862C113.279 27.602 112.565 30.628 111.137 32.872C109.573 35.252 107.363 36.476 104.507 36.476C101.651 36.476 99.4406 35.252 97.8766 32.872C96.4486 30.628 95.7346 27.636 95.7346 23.862C95.7346 20.054 96.4486 17.062 97.8766 14.852C99.4406 12.438 101.651 11.248 104.507 11.248ZM104.507 14.376C102.501 14.376 101.107 15.464 100.291 17.674C99.6786 19.17 99.4066 21.244 99.4066 23.862C99.4066 26.446 99.6786 28.52 100.291 30.05C101.107 32.226 102.501 33.348 104.507 33.348C106.479 33.348 107.907 32.226 108.723 30.05C109.301 28.52 109.607 26.446 109.607 23.862C109.607 21.244 109.301 19.17 108.723 17.674C107.907 15.464 106.479 14.376 104.507 14.376Z" fill="white"/>
            <path d="M172.939 23L196.204 36.9592L185.735 35.4082L172.939 23Z" fill="#3F74B4"/>
            <path d="M139.204 85.4286L105.082 45.8776L172.939 23L209 57.898L139.204 85.4286Z" fill="#DBEBFF"/>
            <path d="M69.4082 82.7143L105.082 45.8775L37.6122 21.449L0 54.4082L69.4082 82.7143Z" fill="#DBEBFF"/>
          </svg>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
</style>

