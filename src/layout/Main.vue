<script setup lang="ts">
import SideBar from './SideBar.vue'
import Header from './Header.vue'
</script>

<template>
  <div class="wrapper">
    <SideBar class="SideBar" />
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
  .SideBar {
    position: fixed;
    width: 180px;
    height: 100vh;
    z-index: 999;
    box-shadow: var(--box-shadow);
    background: var(--background-theme);
  }

  .main {
    width: calc(100vw - 180px);
    margin-left: 180px;
    padding-top: 50px;
    .Header {
      position: fixed;
      background: var(--background);
      color: var(--text-color);

      width: calc(100vw - 180px);
      top: 0px;
      left: 180px;
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
