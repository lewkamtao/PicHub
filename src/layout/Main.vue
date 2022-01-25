<script setup lang="ts">
import Header from './Header.vue'
import { useMessage } from 'naive-ui'
window.$message = useMessage()
</script>

<template>
  <div class="wrapper">
    <div class="main"> 
      <Header class="Header" />
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  margin: 0 auto;
  display: flex;
  .main {
    width: 100vw;
    padding-top: 50px;
    .Header {
      position: fixed;
      background: var(--background);
      color: var(--text-color);
      width: 100vw;
      top: 0px;
      height: 50px;
      box-shadow: var(--box-shadow);
      z-index: 99;
    }
    .wrapper {
      padding: 20px;
      min-height: calc(100vh - 60px);
      box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
</style>
