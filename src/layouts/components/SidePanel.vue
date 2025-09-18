<script setup lang="ts">
import { useMenu } from '@/layouts/useMenu'

const { menuTree, openKeys, selectedKeys, onMenuItemClick } = useMenu()
</script>

<template>
  <div class="h-full flex flex-col" role="navigation" aria-label="主导航">
    <div class="h-16 flex items-center justify-center">
      <router-link to="/home" class="inline-flex items-center" aria-label="返回首页">
        <img src="@/assets/logo.svg" alt="logo" />
      </router-link>
    </div>
    <div class="flex-1 overflow-auto">
      <a-menu
        class="side-panel-menu"
        v-model:open-keys="openKeys"
        :selected-keys="selectedKeys"
        @menu-item-click="onMenuItemClick"
      >
        <template v-for="item in menuTree" :key="item.path">
          <a-menu-item v-if="!item.children || !item.children.length" :key="`leaf:${item.path}`">
            {{ item.title }}
          </a-menu-item>
          <a-sub-menu v-else :key="`group:${item.path}`">
            <template #title>
              {{ item.title }}
            </template>
            <a-menu-item v-for="child in item.children" :key="`leaf:${child.path}`">
              {{ child.title }}
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </div>
  </div>
</template>

<style scoped>
.side-panel-menu :deep(.arco-menu-light) {
  background-color: transparent;
}

.side-panel-menu :deep(.arco-menu-light .arco-menu-item:hover),
.side-panel-menu :deep(.arco-menu-light .arco-menu-inline-header:hover) {
  color: rgb(var(--primary-6));
  background-color: rgba(var(--primary-6), 0.08);
}

.side-panel-menu :deep(.arco-menu-light .arco-menu-item:hover .arco-icon),
.side-panel-menu :deep(.arco-menu-light .arco-menu-item:hover .arco-menu-icon),
.side-panel-menu :deep(
    .arco-menu-light .arco-menu-inline-header:hover .arco-icon
  ),
.side-panel-menu :deep(
    .arco-menu-light .arco-menu-inline-header:hover .arco-menu-icon
  ) {
  color: rgb(var(--primary-6));
}

.side-panel-menu :deep(.arco-menu-light .arco-menu-item.arco-menu-selected) {
  color: rgb(var(--primary-6));
  background-color: rgba(var(--primary-6), 0.14);
}

.side-panel-menu :deep(
    .arco-menu-light .arco-menu-item.arco-menu-selected .arco-icon
  ),
.side-panel-menu :deep(
    .arco-menu-light .arco-menu-item.arco-menu-selected .arco-menu-icon
  ),
.side-panel-menu :deep(
    .arco-menu-light .arco-menu-inline-header.arco-menu-selected .arco-icon
  ),
.side-panel-menu :deep(
    .arco-menu-light .arco-menu-inline-header.arco-menu-selected .arco-menu-icon
  ) {
  color: rgb(var(--primary-6));
}

.side-panel-menu :deep(.arco-menu-light .arco-menu-inline-header.arco-menu-selected) {
  background-color: rgba(var(--primary-6), 0.08);
}
</style>
