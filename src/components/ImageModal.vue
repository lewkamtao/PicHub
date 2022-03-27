<script setup lang="ts">
import { Alert } from '../util/alert'
import axios from '../axios/http'
import { onMounted, reactive, ref, defineProps } from 'vue'
const props = defineProps({ isOpen: Boolean })
</script>

<template>
  <div class="image-modal" :class="{ isOpen: props.isOpen }">
    <div class="title">上传图片</div>
  </div>
</template>

<style lang="scss" scoped>
.image-modal {
  position: fixed;
  left: -300px;
  width: 500px;
  min-height: 100vh;
  background: var(--background);
  border-right: 1px var(--border-color) solid;
  box-sizing: border-box;
  z-index: 9;
  transition: all 0.25s;
  padding: 20px;
  box-sizing: border-box;
  .title {
    font-size: 24px;
    font-weight: bold;
  }
}
.isOpen {
  left: 200px;
}
</style>
