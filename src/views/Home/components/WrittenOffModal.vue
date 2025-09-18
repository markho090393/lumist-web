<script setup lang="ts">
import { reactive } from 'vue'

// 外部控制可见性
const visible = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  (e: 'confirm', code: string): void
}>()

const form = reactive({
  code: '',
})

const close = () => (visible.value = false)
const onConfirm = () => {
  if (!form.code?.trim()) return
  emit('confirm', form.code.trim())
  close()
}
</script>

<template>
  <a-modal
    v-model:visible="visible"
    :width="560"
    :footer="false"
    :mask-closable="true"
    :render-to-body="false"
    :modal-style="{ borderRadius: '16px' }"
    @cancel="close"
  >
    <template #title>
      <div class="text-center text-[22px] font-600 text-[#2B2F36]">核销</div>
    </template>

    <div class="px-1">
      <a-form :model="form" layout="vertical">
        <a-form-item field="code" label="教练码" :required="true" hide-asterisk="false">
          <a-input
            v-model="form.code"
            size="large"
            allow-clear
            placeholder="TH18456502830"
            class="!rounded-[10px] !h-10"
          />
        </a-form-item>
      </a-form>

      <!-- 提示块 -->
      <div
        class="mt-3 rounded-[10px] bg-[#EAF9F3] px-3 py-3 flex items-start gap-3"
      >
        <div
          class="shrink-0 w-6 h-6 rounded-full bg-[#F04438] text-white flex items-center justify-center mt-0.5 font-700"
          aria-hidden="true"
        >
          ！
        </div>
        <div class="text-[14px] leading-6 text-[#101828]">
          当前即将核销的教练码为上方输入内容。如确认此操作属于本人，请点击
          <strong class="font-600">【确认核销】</strong>
          ；如发现信息不符，请先修正输入框中的教练码后再执行核销。
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="mt-6 flex items-center justify-between">
        <a-button
          shape="round"
          size="large"
          class="!h-10 !px-8 !rounded-[10px] !text-[#667085] !bg-white !border !border-[#E5E7EB]"
          @click="close"
        >
          取消
        </a-button>
        <a-button
          type="primary"
          shape="round"
          size="large"
          class="!h-10 !px-8 !rounded-[10px] hover:opacity-95"
          :disabled="!form.code?.trim()"
          @click="onConfirm"
        >
          确认核销
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
/* 让表单标签更近似设计稿的字重与颜色 */
:deep(.arco-form-item-label-col .arco-form-item-label) {
  color: #2b2f36;
  font-weight: 600;
  font-size: 14px;
}

/* 输入框圆角增强 */
:deep(.arco-input-wrapper) {
  border-radius: 10px;
}
</style>
