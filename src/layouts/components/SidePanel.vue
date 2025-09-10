<script setup lang="ts">
import { useMenu } from '@/layouts/useMenu'

const { menuTree, openKeys, selectedKeys, onMenuItemClick } = useMenu()
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="h-16 flex items-center justify-center">
      <img src="@/assets/logo.svg" alt="logo" />
    </div>
    <div class="flex-1 overflow-auto">
      <a-menu
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
