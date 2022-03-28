<script setup lang="ts">
import Sideber from './components/Sideber.vue'
import { ref } from 'vue'

let isOpenImageModal = ref(false)
let isLoading = ref(false)

const SetImageModal = (value) => {
  isOpenImageModal.value = value
}

const SetLoading = (value) => {
  isLoading.value = value
}

const sideberRef: any = ref(null)
const OpenUploadModel = () => {
  sideberRef.value.changeImageModel()
}
</script>

<template>
  <div class="wrapper">
    <div id="alert-box"></div>
    <Sideber @SetImageModal="SetImageModal" ref="sideberRef"></Sideber>
    <div
      class="main"
      :class="{ loading: isLoading }"
      id="main"
      :style="
        isOpenImageModal
          ? `width:calc(100% - 700px);margin-left:500px`
          : `width:calc(100% - 200px)`
      "
    >
      <router-view
        @SetLoading="SetLoading"
        @OpenUploadModel="OpenUploadModel()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  background: var(--background);
  .main {
    position: relative;
    transition: all 0.25s;
  }
  .main::after {
    position: absolute;
    top: 50%;
    left: 50%;
    content: '';
    border: 4px solid rgba(180, 180, 180, 0.4);
    border-left-color: var(--primary-color);
    border-radius: 50%;
    outline: #eee solid 10000px;
    background: #eee;
    width: 16px;
    height: 16px;
    opacity: 0;
    animation: donut-spin 0.8s linear infinite;
    transition: all 0.25s;
    transform: translate(-50%, -50%);
    z-index: -1;
  }

  .loading::after {
    opacity: 1;
    z-index: 1;
  }

  @keyframes donut-spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
}
</style>
