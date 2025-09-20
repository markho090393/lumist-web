<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

// 进度与统计（演示数据，后续可替换为接口）
const curIndex = ref(1) // 第几题（1-based）
const total = ref(15)
const finished = ref(10)
const correct = ref(10)
const wrong = ref(0)
const accuracy = computed(() => (total.value ? Math.round((correct.value / total.value) * 100) : 0))

// 步骤：0-拆分拼写 1-自然拼读 2-字母拼写
const step = ref(0)

// 词与片段（示意）
const word = ref('cloud')
const syllables = reactive<string[]>(['cloud'])
const phonics = reactive<string[]>(['cl', 'ou', 'd'])
const letters = reactive<string[]>(['c', 'l', 'o', 'u', 'd'])

const reset = () => {
  // 示例：仅复位 UI 状态，不改动统计
  // 可扩展为打乱、清空输入等
}

const nextStep = () => {
  if (step.value < 2) step.value += 1
}

// 允许点击步骤条切换（Arco Steps 的 current 为 1-based）
const onStepChange = (current: number) => {
  step.value = Math.max(0, Math.min(2, current - 1))
}

const skip = () => {
  // 示例：跳过当前题，直接进入下一题或保持 UI 提示
}
</script>

<template>
  <div class="p-6">
    <div class="text-[18px] text-[#111827] mb-4">拼写训练 {{ curIndex }}/{{ total }}</div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 左侧：统计与释义 -->
      <div class="space-y-6">
        <div class="rounded-xl bg-white p-5 shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
          <div class="text-[16px] font-700 text-[#2B2F36] mb-4">学习统计</div>
          <div class="text-[13px] text-[#64748B] mb-2">已完成 <span class="text-[#16A34A]">{{ finished }}/{{ total }}</span></div>
          <div class="h-2 rounded bg-[#E5E7EB] overflow-hidden mb-3">
            <div class="h-full bg-[#16A34A]" :style="{ width: `${Math.round((finished/total)*100)}%` }"></div>
          </div>
          <div class="text-[13px] text-[#64748B] mb-2">正确率 <span class="text-[#16A34A]">{{ accuracy }}%</span></div>
          <div class="h-2 rounded bg-[#E5E7EB] overflow-hidden">
            <div class="h-full bg-[#16A34A]" :style="{ width: `${accuracy}%` }"></div>
          </div>
          <div class="mt-4 space-y-2">
            <div class="flex items-center gap-2 text-[#16A34A]"><i class="i-ph:check-circle text-[16px]"></i><span>正确</span><span class="ml-auto text-[#2B2F36]">{{ correct }}</span></div>
            <div class="flex items-center gap-2 text-[#EF4444]"><i class="i-ph:x-circle text-[16px]"></i><span>错误</span><span class="ml-auto text-[#2B2F36]">{{ wrong }}</span></div>
          </div>
        </div>

        <div class="rounded-xl bg-white p-5 shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
          <div class="text-[16px] font-700 text-[#2B2F36] mb-4">释义</div>
          <div class="text-[#475569]">n. 鸡肉；鸡</div>
        </div>
      </div>

      <!-- 右侧：主训练区域 -->
      <div class="col-span-2 rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)]">
        <!-- 顶部步骤条 -->
        <div class="p-5 border-b border-[#EEF2F7]">
          <div class="flex items-center justify-center">
            <div class="w-full max-w-[640px]">
              <a-steps :current="step + 1" class="!text-[#2E9885]" @change="onStepChange">
                <a-step title="拆分拼写"></a-step>
                <a-step title="自然拼读"></a-step>
                <a-step title="字母拼写"></a-step>
              </a-steps>
            </div>
          </div>
        </div>

        <!-- 内容区 -->
        <div class="p-6 md:p-10">
          <!-- Step 1 -->
          <div v-if="step===0" class="">
            <div class="text-center">
              <div class="text-[20px] font-700 text-[#2B2F36]">拆分拼写</div>
              <div class="text-[#9AA3AF] mt-1">听发音观察单词的音节结构</div>
              <div class="mt-4 inline-flex items-center gap-2 bg-[#2E9885] text-white rounded-full h-9 px-4">
                <span>/ˈtʃɪkn/</span>
                <i class="i-ph:speaker-high-bold text-[18px]"></i>
                <span>播放发音</span>
              </div>
            </div>

            <div class="mt-8 flex flex-col items-center gap-6">
              <div class="px-4 h-10 rounded-lg border border-[#2E9885] text-[#2E9885] flex items-center">{{ word }}</div>

              <div class="w-full max-w-[680px]">
                <div class="h-14 rounded-xl bg-[#F3F4F6] text-[#2E9885] flex items-center justify-center text-[20px]">{{ word }}</div>
              </div>

              <div class="flex items-center gap-2 text-[#2E6F67] cursor-pointer" @click="reset">
                <i class="i-ph:arrow-counter-clockwise text-[18px]"></i>
                <span>复位</span>
              </div>
            </div>

            <div class="mt-10 flex items-center justify-center">
              <a-button shape="round" class="!h-10 !px-8 !rounded-full" @click="nextStep">下一步</a-button>
            </div>
          </div>

          <!-- Step 2 -->
          <div v-else-if="step===1" class="">
            <div class="text-center">
              <div class="text-[20px] font-700 text-[#2B2F36]">自然拼读</div>
              <div class="text-[#9AA3AF] mt-1">根据上一步学习的单词发音，拼出完整单词</div>
              <a-button type="outline" shape="round" class="!h-9 !px-4 mt-4">
                <i class="i-ph:speaker-high-bold text-[18px] mr-1"></i>
                再次听发音
              </a-button>
            </div>

            <div class="mt-8 flex flex-col items-center gap-6">
              <div class="flex items-center gap-3">
                <div v-for="(p,idx) in phonics" :key="idx" class="px-4 h-10 rounded-lg border border-[#2E9885] text-[#2E9885] flex items-center">{{ p }}</div>
              </div>

              <div class="w-full max-w-[680px]">
                <div class="h-14 rounded-xl bg-[#F3F4F6] text-[#2B2F36] flex items-center justify-center text-[20px]">clo</div>
              </div>

              <div class="flex items-center gap-2 text-[#2E6F67] cursor-pointer" @click="reset">
                <i class="i-ph:arrow-counter-clockwise text-[18px]"></i>
                <span>复位</span>
              </div>
            </div>

            <div class="mt-10 flex items-center justify-center">
              <a-button shape="round" class="!h-10 !px-8 !rounded-full" @click="nextStep">下一步</a-button>
            </div>
          </div>

          <!-- Step 3 -->
          <div v-else class="">
            <div class="text-center">
              <div class="text-[20px] font-700 text-[#2B2F36]">字母拼写</div>
              <div class="text-[#9AA3AF] mt-1">根据上一步学习的单词发音，拼出完整单词</div>
              <a-button type="outline" shape="round" class="!h-9 !px-4 mt-4">
                <i class="i-ph:speaker-high-bold text-[18px] mr-1"></i>
                再次听发音
              </a-button>
            </div>

            <div class="mt-8 flex flex-col items-center gap-6">
              <div class="w-full max-w-[680px]">
                <div class="h-14 rounded-xl bg-[#F3F4F6] text-[#2B2F36] flex items-center justify-center text-[20px]">clo</div>
              </div>

              <div class="flex items-center gap-2 text-[#2E6F67] cursor-pointer" @click="reset">
                <i class="i-ph:arrow-counter-clockwise text-[18px]"></i>
                <span>复位</span>
              </div>

              <div class="flex items-center gap-3">
                <div v-for="(l,idx) in letters" :key="idx" class="w-10 h-10 rounded-lg flex items-center justify-center text-[16px]"
                     :class="idx<3 ? 'bg-[#E5E7EB] text-[#6B7280]' : 'border border-[#2E9885] text-[#2E9885]'">
                  {{ l }}
                </div>
              </div>
            </div>

            <div class="mt-10 flex items-center justify-center">
              <a-button status="danger" shape="round" class="!h-10 !px-8 !rounded-full">跳过</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
