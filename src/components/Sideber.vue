<script setup lang="ts">
import ImageModal from './ImageModal.vue'
import FolderModal from './FolderModal.vue'
import LewButton from './base/LewButton.vue'
import { Alert } from '../util/alert'

import axios from '../axios/http'
import { onMounted, ref, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { GithubConfig } from '../model/github_config.model'
const route = useRoute()
const router = useRouter()
const emit = defineEmits(['SetImageModal'])

let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

let folders = ref([] as any)
let isOpenImageModal = ref(false)
let isOpenFolderModal = ref(false)

onMounted(() => {
  if (github_config?.repoId) {
    GetFolders()
  }
})

watch(
  () => route.query,
  (n: any) => {
    isOpenFolderModal.value = false
    if (!github_config?.owner && route.path != '/setting') {
      router.push('/setting')
    } else if (route.query.reload) {
      GetFolders()
    }
  }
)

watch(
  () => isOpenImageModal.value,
  (n: any) => {
    if (isOpenImageModal.value) {
      emit('SetImageModal', true)
    } else {
      emit('SetImageModal', false)
    }
  }
)

const GetFolders = () => {
  axios
    .get({
      url: `/repositories/${
        github_config.repoId
      }/contents?t=${new Date().getTime()}`,
    })
    .then((res: any) => {
      folders.value = res.data.filter((e) => e.type == 'dir')
      if (route.path == '/' && !route.query.folder) {
        router.push(`/?folder=${folders.value[0].name}`)
      }
    })
}

const changeImageModel = () => {
  if (!github_config?.owner) {
    Alert({
      type: 'danger',
      text: 'Github账号未授权',
    })
    return
  }
  isOpenImageModal.value = !isOpenImageModal.value
}

defineExpose({
  changeImageModel,
})
</script>

<template>
  <div class="wrapper">
    <!-- 侧边栏  -->
    <div class="sidebar">
      <div class="header">
        <div class="mask"></div>
        <div class="logo">Pic<span>Hub</span></div>
      </div>
      <!-- 文件夹列表 -->
      <div class="folder">
        <a
          v-for="(item, index) in folders"
          :key="index"
          class="item"
          :class="{ active: route.query.folder == item.name }"
          :href="`/#/?folder=${item.name}`"
        >
          {{ item.name }}
          <span class="status-point"></span>
        </a>

        <div class="item">
          <span v-if="folders.length != 0">{{ folders.length }} folders</span>
          <span v-if="github_config?.owner && folders.length == 0"
            >暂无文件夹</span
          >
          <span v-if="!github_config?.owner">未授权</span>
        </div>
      </div>

      <!-- 操作栏 -->
      <folder-modal
        @close="isOpenFolderModal = false"
        @updateFolderList="GetFolders()"
        :isOpen="isOpenFolderModal"
      ></folder-modal>
      <div class="handle-box">
        <!-- 创建文件夹 -->
        <lew-button @click="changeImageModel"> 图片上传 </lew-button>

        <lew-button @click="isOpenFolderModal = !isOpenFolderModal">
          创建文件夹
        </lew-button>
        <a href="/#/setting"> <lew-button> 设置 </lew-button></a>
        <a href="/#/about"> <lew-button> 关于 </lew-button></a>
      </div>
    </div>
    <!-- 上传图片 -->
    <image-modal
      :isOpen="isOpenImageModal"
      :folders="folders"
      @close="changeImageModel"
    ></image-modal>
  </div>
</template>
<style>
.image-info .item {
  font-size: 14px;
  margin-bottom: 20px;
}
.image-info div {
  word-wrap: break-word;
  width: 100%;
}
.image-info div span {
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: #999;
}
</style>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
  border-right: 1px var(--border-color) solid;
  box-sizing: border-box;
  height: 100vh;
  overflow-y: scroll;
  z-index: 99;
  .header {
    position: fixed;
    left: -1px;
    height: 70px;
    width: 200px;
    display: flex;
    z-index: 99;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 1px var(--border-color) solid;
    .mask {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      background-color: var(--background);
      z-index: -1;
    }
    .logo {
      position: relative;
      font-size: 26px;
      font-weight: bolder;
      color: var(--text-color);

      span {
        background: var(--primary-color);
        color: #fff;
        border-radius: 4px;
        padding: 0px 4px;
        margin-left: 4px;
      }
    }
  }
  .folder {
    margin-top: 70px;
    padding-bottom: calc(45px * 4 + 38px);
    background: var(--background);
    min-height: calc(100vh - 400px);
    .item {
      position: relative;
      display: flex;
      align-items: center;
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
      padding: 0px 20px;
      width: 200px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      transition: all 0.1s;
      color: var(--text-color-2);
      cursor: pointer;
      border-bottom: 1px var(--border-color) solid;
      .status-point {
        width: 8px;
        height: 8px;
        margin-left: 10px;
        border-radius: 8px;
        display: inline-block;
        background: #27c24c;
        transition: opacity 0.25s;
        opacity: 0;
      }
    }
    .active {
      .status-point {
        opacity: 1;
      }
    }
    .item:hover {
      color: var(--text-color);
      background: var(--hover-bg-color);
    }
    .item:last-child {
      justify-content: center;
      opacity: 0.5;
      font-size: 12px;
    }
    .item:last-child:hover {
      color: var(--text-color-2);
      background: none;
    }
  }
  .handle-box {
    width: 200px;
    height: calc(45px * 4 + 38px);
    position: fixed;
    left: -1px;
    bottom: 0px;
    background: var(--background-2);
    border-top: 1px var(--border-color) solid;
    padding: 7px;
    box-sizing: border-box;
    z-index: 99;
  }
}
</style>
