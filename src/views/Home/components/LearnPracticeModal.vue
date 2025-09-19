<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// 学练一体弹窗
// - v-model 控制可见性
// - 两步：1) 拆分拼写 2) 字母拼写
// - 采用 Arco + UnoCSS，尽量还原视觉

const visible = defineModel<boolean>({ default: false })

const props = withDefaults(
  defineProps<{
    word?: string
    ipa?: string
    meaning?: string
    // 自然拼读分片
    segments?: Array<{ text: string; ipa: string }>
    // 初始步骤：1 | 2
    initialStep?: 1 | 2
  }>(),
  {
    word: 'cloud',
    ipa: '/klaʊd/',
    meaning: 'n. 云；云朵',
    segments: () => [
      { text: 'cl', ipa: '/kl/' },
      { text: 'ou', ipa: '/əʊ/' },
      { text: 'd', ipa: '/d/' },
    ],
    initialStep: 1,
  },
)

const step = ref<1 | 2>(props.initialStep)

// 朗读（Web Speech API，降级静默）
const speak = (t?: string) => {
  const text = (t || props.word || '').trim()
  if (!text) return
  try {
    const synth = window?.speechSynthesis
    if (!synth) return
    const ut = new SpeechSynthesisUtterance(text)
    ut.rate = 0.95
    ut.pitch = 1
    ut.lang = 'en-US'
    synth.cancel()
    synth.speak(ut)
  } catch {}
}

// Step2 - 字母拼写
type Token = { id: number; char: string; used: boolean }
const tokens = ref<Token[]>([])
const inputVal = ref('')

const resetStep2 = () => {
  const letters = (props.word || '').split('')
  const shuffled = letters
    .map((c, i) => ({ id: i + 1, char: c }))
    .sort(() => Math.random() - 0.5)
  tokens.value = shuffled.map((x) => ({ ...x, used: false }))
  inputVal.value = ''
}

watch(
  () => props.word,
  () => resetStep2(),
  { immediate: true },
)

// 打开弹窗时重置至步骤一（或传入的 initialStep）
watch(
  visible,
  (val) => {
    if (val) {
      step.value = props.initialStep ?? 1
      resetStep2()
    }
  },
)

const canSubmit = computed(() => inputVal.value.length === (props.word?.length || 0))
const isCorrect = computed(() => inputVal.value.toLowerCase() === (props.word || '').toLowerCase())

const onPick = (t: Token) => {
  if (t.used) return
  inputVal.value += t.char
  t.used = true
}
const onReset = () => resetStep2()

const close = () => (visible.value = false)
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :width="920"
    :footer="false"
    :mask-closable="true"
    :render-to-body="false"
    :body-style="{ padding: '16px 20px 20px 20px' }"
    :modal-style="{ borderRadius: '16px', backgroundColor: '#F3F3F3' }"
    @cancel="close"
  >
    <template #title>
      <div class="text-[20px] font-600 text-[#2B2F36]">学练一体</div>
    </template>

    <!-- 步骤条 -->
    <div class="rounded-xl bg-white px-8 py-4 mb-4">
      <a-steps :current="step" size="small" label-placement="vertical">
        <a-step title="拆分拼写" />
        <a-step title="字母拼写" />
      </a-steps>
    </div>

    <!-- 内容 -->
    <div class="space-y-4">
      <!-- Step 1: 拆分拼写 -->
      <div v-if="step === 1" class="space-y-4">
        <div class="rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] p-8 text-center">
          <div class="text-[40px] leading-none font-700 text-[rgb(var(--primary-6))]">{{ props.word }}</div>
          <div class="mt-4 flex items-center justify-center gap-3">
            <a-button type="primary" size="small" shape="round" class="!rounded-full">
              <template #icon>
                <i class="i-ph:speaker-high" />
              </template>
              {{ props.ipa }}
            </a-button>
          </div>
          <div class="mt-3">
            <a-tag color="arcoblue" class="!bg-[rgba(var(--primary-6),0.12)] !text-[rgb(var(--primary-6))] !border-0">
              {{ props.word }}
            </a-tag>
          </div>
        </div>

        <!-- 自然拼读 -->
        <div class="rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] p-5">
          <div class="mb-3">
            <a-button size="mini" shape="round" class="!h-6 !px-2.5 !rounded-full bg-[rgba(var(--primary-6),0.18)] !border-0 !text-[rgb(var(--primary-6))]">
              自然拼读
            </a-button>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="(s, i) in props.segments"
              :key="i"
              class="rounded-lg bg-[#F6F7F9] h-24 flex flex-col items-center justify-center"
            >
              <div class="text-[20px] font-600 text-[#2B2F36]">{{ s.text }}</div>
              <div class="text-[14px] text-[#6B7280] mt-1">{{ s.ipa }}</div>
            </div>
          </div>
        </div>

        <!-- 操作 -->
        <div class="flex items-center justify-end gap-3">
          <a-button shape="round" class="!h-9 !px-5 !rounded-full !text-[#667085] !bg-white !border !border-[#E5E7EB]" @click="close">关闭</a-button>
          <a-button type="primary" shape="round" class="!h-9 !px-6 !rounded-full" @click="step = 2">进入字母拼写</a-button>
        </div>
      </div>

      <!-- Step 2: 字母拼写 -->
      <div v-else class="space-y-4">
        <div class="rounded-xl bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] p-8 text-center">
          <div class="text-[26px] font-700 text-[#2B2F36]">学练一体</div>
          <div class="text-[14px] text-[#6B7280] mt-1">请输入完整单词</div>
          <div class="mt-3 flex items-center justify-center">
            <a-button type="outline" shape="round" class="!h-8 !px-3 !rounded-full !text-[rgb(var(--primary-6))] !border-[rgba(var(--primary-6),0.4)]" @click="speak(props.word)">
              <template #icon>
                <i class="i-ph:speaker-high" />
              </template>
              再次听发音
            </a-button>
          </div>
          <div class="text-[14px] text-[#6B7280] mt-4">{{ props.meaning }}</div>

          <!-- 输入框 + 复位 -->
          <div class="mt-5 flex items-center justify-center gap-3">
            <a-input v-model="inputVal" :max-length="props.word?.length" class="!rounded-[10px] !h-10 w-[260px] text-center text-[18px]" placeholder="" />
            <a-button type="text" class="!text-[rgb(var(--primary-6))]">
              <template #icon>
                <i class="i-ph:arrow-counter-clockwise text-[18px]" />
              </template>
              <span class="ml-1" @click="onReset">复位</span>
            </a-button>
          </div>

          <!-- 字母卡片区 -->
          <div class="mt-6 flex items-center justify-center gap-3">
            <button
              v-for="t in tokens"
              :key="t.id"
              class="min-w-10 h-10 px-3 rounded-[10px] border-2 text-[16px] font-600"
              :class="t.used ? 'bg-[#E5F5F1] border-[rgba(var(--primary-6),0.45)] text-[rgb(var(--primary-6))] opacity-60 cursor-not-allowed' : 'bg-transparent border-[rgba(var(--primary-6),0.45)] text-[rgb(var(--primary-6))] hover:bg-[rgba(var(--primary-6),0.06)]'"
              @click="onPick(t)"
            >
              {{ t.char }}
            </button>
          </div>

          <div class="mt-4 text-[13px]" :class="isCorrect ? 'text-[#16A34A]' : 'text-[#9CA3AF]'">
            {{ canSubmit ? (isCorrect ? '正确！' : '与目标不一致') : '点击下方字母完成拼写' }}
          </div>
        </div>

        <div class="flex items-center justify-between">
          <a-button shape="round" class="!h-9 !px-5 !rounded-full !text-[#667085] !bg-white !border !border-[#E5E7EB]" @click="(step = 1)">返回拆分拼写</a-button>
          <div class="flex items-center gap-3">
            <a-button shape="round" class="!h-9 !px-5 !rounded-full !text-[#667085] !bg-white !border !border-[#E5E7EB]" @click="close">关闭</a-button>
            <a-button type="primary" shape="round" class="!h-9 !px-6 !rounded-full" :disabled="!isCorrect">完成</a-button>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
/* 微调 Steps 的间距与字号，使更贴合设计稿 */
:deep(.arco-steps) {
  justify-content: center;
}
:deep(.arco-steps-item-title) {
  font-weight: 600;
}
</style>
