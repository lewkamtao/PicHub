<script setup lang="ts">
import { Alert } from '../util/alert'
import axios from '../axios/http'
import { uploadHelper } from '../util/uploadHelper'
import { onMounted, watch, ref, defineProps } from 'vue'
import LewButton from './base/LewButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { GithubConfig } from '../model/github_config.model'
import { UploadImage } from '../model/upload_image.model'
import { GetFileSize, CopyText } from '../util/util'

const route = useRoute()
const router = useRouter()

const props = defineProps({ isOpen: Boolean, folders: Array as any })

let folder = ref(route.query.folder)
let upload_list = ref<UploadImage[]>([])
let history_list = ref<UploadImage[]>([])

onMounted(() => {
  if (localStorage.getItem('history_list')) {
    history_list.value = JSON.parse(localStorage.getItem('history_list') as any)
  }
})

watch(
  () => route.query,
  (n: any) => {
    folder.value = n.folder
  }
)

let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

let loading = ref(false)

const AddImage = async (e) => {
  if (!!!folder.value) {
    Alert({
      type: 'danger',
      text: '请选择文件夹',
    })
    return
  }

  let files = e.target.files
  let upload_files: any = []
  upload_files = await Promise.all(
    [...files].map((e) => {
      // 等待异步操作完成，返回执行结果
      return uploadHelper(e, folder.value)
    })
  )
  upload_list.value = upload_list.value.concat(upload_files)
}

const Upload = async () => {
  loading.value = true
  let timer = 0
  await Promise.all(
    upload_list.value.map((e, i) => {
      upload_list.value[i].status = 'uploading'
      // 等待异步操作完成，返回执行结果
      return new Promise((resolve) => {
        setTimeout(() => {
          axios
            .put({
              url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${folder.value}/${e.name}
          `,
              data: {
                message: 'upload a image by pichub',
                content: e.base64data,
              },
            })
            .then((res: any) => {
              e.status = 'success'
              upload_list.value[i].status = 'success'
              e.url = res.data.url
              e.download_url = res.data.download_url
              e.git_url = res.data.git_url
              e.sha = res.data.sha
              e.html_url = res.data.html_url
              history_list.value.unshift(e)
              resolve(200)
            })
            .catch(() => {
              e.status = 'fail'
              upload_list.value[i].status = 'fail'
              resolve(400)
            })
        }, (timer += 1000))
      })
    })
  )
  Alert({
    type: 'success',
    text: '上传完成',
  })
  upload_list.value = upload_list.value.filter((e) => e.status != 'success')
  loading.value = false
  localStorage.setItem('history_list', JSON.stringify(history_list.value))

  router.push((route.fullPath += '&t=' + new Date().getTime()) as any)
}
</script>

<template>
  <div class="image-modal" :class="{ isOpen: props.isOpen }">
    <div class="select">
      <div class="title-3">选择文件夹</div>
      <select v-model="folder">
        <option value="" hidden>请选择</option>
        <option
          v-for="folder in props.folders"
          :value="folder.name"
          :key="folder.name"
        >
          {{ folder.name }}
        </option>
      </select>
    </div>

    <div class="upload-list">
      <label class="upload-box">
        <svg
          class="upload-icon"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
        >
          <path
            d="M320 367.79h76c55 0 100-29.21 100-83.6s-53-81.47-96-83.6c-8.89-85.06-71-136.8-144-136.8c-69 0-113.44 45.79-128 91.2c-60 5.7-112 43.88-112 106.4s54 106.4 120 106.4h56"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="18"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="18"
            d="M320 255.79l-64-64l-64 64"
          ></path>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="18"
            d="M256 448.21V207.79"
          ></path></svg
        >点击或拖拽到此处上传文件
        <input
          @change="AddImage"
          v-show="false"
          type="file"
          name="file"
          accept="image/*"
          multiple
        />
      </label>
      <div v-show="upload_list.length > 0" class="title-3">待上传图片</div>
      <div v-for="item in upload_list" :key="item.name" class="item">
        <div class="info">
          <div class="name">
            {{ item.name }}
            <svg
              v-show="item.status == 'success'"
              class="icon icon-success"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="square"
                stroke-miterlimit="10"
                stroke-width="44"
                d="M416 128L192 384l-96-96"
              ></path>
            </svg>
            <svg
              v-show="item.status == 'uploading'"
              class="icon icon-uploading"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
            >
              <path
                d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208s208-93.13 208-208S370.87 48 256 48zm83.69 282.65a112.24 112.24 0 0 1-195-61.29a16 16 0 0 1-20.13-24.67l23.6-23.6a16 16 0 0 1 22.37-.25l24.67 23.6a16 16 0 0 1-18 26a80.25 80.25 0 0 0 138.72 38.83a16 16 0 0 1 23.77 21.41zm47.76-63.34l-23.6 23.6a16 16 0 0 1-22.37.25l-24.67-23.6a16 16 0 0 1 17.68-26.11A80.17 80.17 0 0 0 196 202.64a16 16 0 1 1-23.82-21.37a112.17 112.17 0 0 1 194.88 61.57a16 16 0 0 1 20.39 24.47z"
                fill="currentColor"
              ></path>
            </svg>

            <svg
              v-show="item.status == 'fail'"
              class="icon icon-fail"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
            >
              <path
                d="M400 145.49L366.51 112L256 222.51L145.49 112L112 145.49L222.51 256L112 366.51L145.49 400L256 289.49L366.51 400L400 366.51L289.49 256L400 145.49z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div class="tag-box">
            <span class="tag folder">{{ item.folder }}</span>
            <span class="tag orginal-size">{{
              GetFileSize(item.orginal_size)
            }}</span>
            <span class="tag compress-size">{{
              GetFileSize(item.compress_size)
            }}</span>
          </div>
        </div>
        <img :src="item.base64" class="image" />
      </div>
    </div>
    <LewButton
      @click="Upload"
      v-show="upload_list.length > 0"
      type="primary"
      :loading="loading"
      >开始上传</LewButton
    >
    <LewButton
      @click="upload_list = []"
      v-show="upload_list.length > 0"
      type="danger"
      >清空列表</LewButton
    >
    <div v-show="history_list?.length > 0" class="upload-list">
      <div class="title-3">上传历史</div>
      <div v-for="item in history_list" :key="item.name" class="item">
        <div class="info">
          <div class="name">
            {{ item.name }}
            <svg
              v-show="item.status == 'success'"
              class="icon icon-success"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="square"
                stroke-miterlimit="10"
                stroke-width="44"
                d="M416 128L192 384l-96-96"
              ></path>
            </svg>
          </div>
          <div class="tag-box">
            <span class="tag folder">{{ item.folder }}</span>
            <span class="tag orginal-size">{{
              GetFileSize(item.orginal_size)
            }}</span>
            <span class="tag compress-size">{{
              GetFileSize(item.compress_size)
            }}</span>
          </div>
        </div>
        <img :src="item.base64" class="image" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-modal {
  position: fixed;
  left: -300px;
  width: 500px;
  height: 100vh;
  background: var(--background-2);
  border-right: 1px var(--border-color) solid;
  box-sizing: border-box;
  z-index: 9;
  transition: all 0.25s;
  padding: 28px 14px;
  box-sizing: border-box;
  overflow-y: scroll;
  .upload-box {
    width: 100%;
    background: var(--background);
    margin: 10px 0px;
    border-radius: 12px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #999;
    border: 3px dashed rgba($color: #000000, $alpha: 0.2);
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.15s;
    .upload-icon {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }
  }
  .upload-box:hover {
    border: 3px dashed var(--primary-color);
    color: var(--primary-color);
    .upload-icon {
      color: var(--primary-color);
    }
  }
  .title-3 {
    margin-bottom: 10px;
    margin-top: 30px;
  }
  .select .title-3 {
    margin-top: 10px;
  }
  .upload-list {
    .item {
      display: flex;
      align-items: center;
      border-radius: 12px;
      background: var(--background);
      margin-bottom: 7px;
      width: 100%;
      height: 70px;
      box-sizing: border-box;
      border: 1px solid var(--border-color);
      padding: 10px;

      .image {
        width: 50px;
        height: 100%;
        object-fit: cover;
        border-radius: 7px;
        border: 1px solid var(--border-color);
      }
      .info {
        margin-right: 10px;
        width: calc(100% - 60px);

        .name {
          display: inline;
          position: relative;
          max-width: calc(100% - 120px);
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          .icon {
            position: absolute;
            top: 50%;
            right: -35px;
            transform: translate(-50%, -50%);
            width: 18px;
            margin-left: 10px;
          }
          .icon-success {
            color: rgb(88, 212, 160);
          }
          .icon-fail {
            color: rgb(194, 69, 69);
          }
          .icon-uploading {
            color: rgb(45, 165, 212);
            animation: uploading 0.8s linear infinite;
          }
          @keyframes uploading {
            0% {
              transform:translate(-50%, -50%) rotate(0deg);
            }
            100% {
              transform:translate(-50%, -50%) rotate(360deg);
            }
          }
        }
        .tag-box {
          margin-top: 10px;
          .tag {
            padding: 2px 4px;
            margin-right: 10px;
            background: var(--background-2);
            border-radius: 2px;
            font-size: 12px;
          }
          .orginal-size {
            text-decoration: line-through;
            color: var(--text-color-2);
          }
          .compress-size {
            background: var(--primary-color);
            color: #fff;
          }
        }
      }
    }
  }
}
.isOpen {
  left: 200px;
}
</style>
