<script setup lang="ts">
import Sideber from './components/Sideber.vue'

</script>

<template>
  <div class="wrapper">
    <div id="alert-box"></div>
    <Sideber></Sideber>

    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  background: var(--background);
}
</style>
