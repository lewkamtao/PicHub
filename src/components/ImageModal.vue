<script setup lang="ts">
import { Alert } from '../util/alert'
import axios from '../axios/http'
import { onMounted, reactive, ref, defineProps } from 'vue'
const props = defineProps({ isOpen: Boolean })
</script>

<template>
  <div class="image-modal" :class="{ isOpen: props.isOpen }"></div>
</template>

<style lang="scss" scoped>
.image-modal {
  position: fixed;
  left: -300px;
  width: 500px;
  min-height: 100vh;
  background: var(--background);
  box-shadow: 220px 0px 220px rgba($color: #000, $alpha: 0.1);
  z-index: 9;
  opacity: 0;
  transition: all 0.25s;
}
.isOpen {
  left: 200px;
  opacity: 1;
}
</style>
