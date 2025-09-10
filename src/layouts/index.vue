<script setup lang="ts">
import SidePanel from './components/SidePanel.vue'
</script>

<template>
    <a-layout class="h-full">
        <a-layout-sider :width="218">
            <SidePanel></SidePanel>
        </a-layout-sider>
        <a-layout class="h-full flex flex-col ">
            <a-layout-header class="h-16">

            </a-layout-header>
            <a-layout-content class="bg-[#F9F9F9] flex-1">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>