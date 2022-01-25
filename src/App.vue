<script setup lang="ts">
import { NMessageProvider } from 'naive-ui'
</script>

<template>
  <n-message-provider>
    <router-view />
  </n-message-provider>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  overflow: hidden;
}
</style>
