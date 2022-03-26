<script setup lang="ts">
import { Alert } from '../util/alert'
import { compressImage } from '../util/upImage'

import axios from '../axios/http'
import { onMounted, ref } from 'vue'
import { GithubConfig } from '../model/github_config.model'

import { useRoute } from 'vue-router'
const route = useRoute()

let folders = ref([] as any)

let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

onMounted(() => {
  if (github_config?.repoId) {
    GetFolders()
  }
})

const GetFolders = () => {
  axios
    .get({
      url: `/repositories/${
        github_config.repoId
      }/contents?t=${new Date().getTime()}`,
    })
    .then((res: any) => {
      folders.value = res.data.filter((e) => e.type == 'dir')
    })
}
const AddImage = async (e) => {
  var file = e.target.files[0]
  axios
    .put({
      url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${route.query.folder}/${file.name}
`,
      data: {
        message: 'upload a image by pichub',
        content: (await compressImage(e.target.files[0], 'mozJPEG')).replace(
          'data:image/jpeg;base64,',
          ''
        ),
      },
    })
    .then((res: any) => {
      Alert({
        type: 'success',
        text: '创建成功！',
      })
      GetFolders()
    })

  Alert({
    type: 'success',
    text: 'sdaad',
  })
}
const AddForder = (forderName) => {
  axios
    .put({
      url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${forderName}/init
`,
      data: {
        message: 'feat:add a forder',
        content: '5q2k5paH5Lu255So5LqO5Yib5bu65paH5Lu25aS5',
      },
    })
    .then((res: any) => {
      Alert({
        type: 'success',
        text: '创建成功！',
      })
      GetFolders()
    })
}
const SettingFn = () => {
  axios
    .get({
      url: `/repositories/433386403/contents/`,
    })
    .then((res: any) => {
      if (res.code == 200) {
      }
    })
}
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
        <a v-if="folders.length != 0" :href="`/#/?folder=lately`" class="item"
          >最近上传</a
        >
        <a
          v-for="(item, index) in folders"
          :key="index"
          class="item"
          :href="`/#/?folder=${item.name}`"
        >
          {{ item.name }}
        </a>

        <div class="item">
          <span v-if="folders.length != 0">{{ folders.length }} folders</span>
          <span v-if="folders.length == 0">暂无文件夹</span>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="handle-box">
        <label class="button">
          <input v-show="false" type="file" @change="AddImage" /> 上传图片
        </label>
        <div @click="AddForder('新2')" class="button">创建文件夹</div>
        <a href="/#/setting" class="button">设置</a>
      </div>
    </div>
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
        background: rgb(209, 207, 207);
        color: #000;
        border-radius: 2px;
        padding: 0px 3px;
        margin-left: 4px;
      }
    }
  }
  .folder {
    margin-top: 70px;
    padding-bottom: calc(45px * 3 + 30px);
    background: var(--background);
    min-height: calc(100vh - 400px);
    .item {
      position: relative;
      display: block;
      height: 50px;
      line-height: 50px;
      box-sizing: border-box;
      padding-left: 20px;
      padding-right: 20px;
      width: 200px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      transition: all 0.1s;
      color: var(--text-color-2);
      cursor: pointer;
      border-bottom: 1px var(--border-color) solid;
    }
    .item:hover {
      color: var(--text-color);
      background: var(--hover-bg-color);
    }
    .item:last-child {
      text-align: center;
      padding-left: 0px;
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
    height: calc(45px * 3 + 30px);
    position: fixed;
    left: -1px;
    bottom: 0px;
    background: var(--background-2);
    border-top: 1px var(--border-color) solid;
    padding: 7px;
    box-sizing: border-box;
  }
}
</style>
