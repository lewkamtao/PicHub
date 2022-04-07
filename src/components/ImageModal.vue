<script setup lang="ts">
import { Alert } from '../util/alert'
import axios from '../axios/http'

import { uploadHelper } from '../util/uploadHelper'
import { onMounted, watch, ref } from 'vue'
import { LewFormItem, LewButton, LewSelect } from '../components/base'

import { useRoute, useRouter } from 'vue-router'
import { GithubConfig } from '../model/github_config.model'
import { UploadImage } from '../model/upload_image.model'
import { GetFileSize, CopyText } from '../util/util'

const route = useRoute()
const router = useRouter()

const props = defineProps({ isOpen: Boolean, folders: Array as any })
const emit = defineEmits(['Close', 'SetLoading'])

let folder: any = ref(route.query.folder) // 文件夹
let upload_list = ref<UploadImage[]>([]) // 上传列表
let history_list: any = ref<UploadImage[]>([]) // 历史列表

// 监听路由变化 改变 需要上传文件夹
watch(
  () => route.query,
  (n: any) => {
    folder.value = n.folder || ''
  }
)
// 获取github配置
let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

let loading_btn: any = ref(null) // 加载按钮

let loading_addupload = ref(false) // 加载按钮

let drop_active = ref(false) // 拖拽状态

onMounted(() => {
  // 历史列表
  if (localStorage.getItem('history_list')) {
    history_list.value = JSON.parse(localStorage.getItem('history_list') as any)
  }
  // 拖拽接听
  let drop_area: any = document.getElementById('drop-area')
  drop_area.addEventListener('drop', DropUpload, false)

  let timer: any = ''

  drop_area.addEventListener('dragleave', (e) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      e.stopPropagation()
      e.preventDefault()
      drop_active.value = false
    }, 200)
  })

  drop_area.addEventListener('dragover', (e) => {
    e.stopPropagation()
    e.preventDefault()
    drop_active.value = true
  })
})

// 拖拽上传
const DropUpload = (e) => {
  if (!!!folder.value) {
    Alert({
      type: 'danger',
      text: '请选择文件夹',
    })
    return
  }
  let files = e.dataTransfer.files
  drop_active.value = false
  e.stopPropagation()
  e.preventDefault()
  let image_files = [] as any
  console.log(files)
  // 搜索剪切板items
  for (let i = 0; i <= files.length - 1; i++) {
    console.log(files[i].type.indexOf('image') !== -1)
    if (files[i].type.indexOf('image') !== -1) {
      image_files.push(files[i])
    } else {
      Alert({
        type: 'danger',
        text: `${files[i].name} 不是图片文件`,
      })
    }
  }
  AddImageToList(image_files)
}

// 监听粘贴操作
const PasteUpload = (e) => {
  if (!!!folder.value) {
    Alert({
      type: 'danger',
      text: '请选择文件夹',
    })
    return
  }
  const items = e.clipboardData.items //  获取剪贴板中的数据
  let files: any = null //  用来保存 files 对象
  if (items.length > 0) {
    //  判断剪贴板中是否是文件
    if (items[0].kind == 'file') {
      files = items[0].getAsFile() //  获取文件
      //  判断是否是图片
      if (files.type.indexOf('image') >= 0) {
        AddImageToList([files])
      } else {
        Alert({
          type: 'danger',
          text: `请粘贴图片文件`,
        })
      }
    } else {
      Alert({
        type: 'danger',
        text: `请粘贴图片文件`,
      })
    }
  }
}

// 点击上传
const ClickUpload = (e) => {
  if (!!!folder.value) {
    Alert({
      type: 'danger',
      text: '请选择文件夹',
    })
    return
  }
  let files = e.target.files

  AddImageToList(files)
}

// 添加图片到上传列表
const AddImageToList = async (image_files) => {
  loading_addupload.value = true
  Alert({
    type: 'warning',
    text: '转码中',
  })
  let upload_files: any = []
  upload_files = await Promise.all(
    [...image_files].map((e) => {
      // 等待异步操作完成，返回执行结果
      return uploadHelper(e, folder.value)
    })
  )
  console.log(upload_files)
  Alert({
    type: 'success',
    text: '转码完成',
  })
  loading_addupload.value = false
  upload_list.value = upload_list.value.concat(upload_files)
}

// 上传到github
const Upload = async (type) => {
  loading_btn.value = type
  let timer = 0
  await Promise.all(
    upload_list.value.map((e, i) => {
      upload_list.value[i].status = 'uploading'
      // 等待异步操作完成，返回执行结果
      return new Promise((resolve) => {
        let filename = type == 1 ? `${e.name}_${e.ext}` : `${e.name}_.jpeg`

        setTimeout(() => {
          axios
            .put({
              url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${folder.value}/${filename}
          `,
              data: {
                message: 'upload a image by pichub',
                content: type == 1 ? e.orginal_base64data : e.base64data,
              },
            })
            .then((res: any) => {
              let image = res.data.content
              e.status = 'success'
              upload_list.value[i].status = 'success'
              e.url = image.url
              e.download_url = image.download_url
              e.git_url = image.git_url
              e.sha = image.sha
              e.upload_type = type
              e.html_url = image.html_url
              addHistory(e)
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

  loading_btn.value = 0
  upload_list.value = upload_list.value.filter((e) => e.status != 'success')
  router.push((route.fullPath += '&t=' + new Date().getTime()) as any)
  localStorage.setItem('history_list', JSON.stringify(history_list.value))
}

const addHistory = (e: any) => {
  let item = {
    name: e.name,
    orginal_size: e.orginal_size,
    compress_size: e.compress_size,
    base64: e.base64,
    folder: e.folder,
    status: e.status,
    ext: e.ext,
  }
  history_list.value.unshift(item)
}

// 设置复制markdown
const GetMarkdownText = (url) => {
  var alt = url.substring(url.lastIndexOf('/') + 1)
  return `![${alt}](${url})`
}

// 设置复制cdn链接
const GetCdnText = (url) => {
  return ` ${url}`
}
</script>

<template>
  <div
    class="image-modal"
    id="drop-area"
    @paste="PasteUpload"
    :class="{ isOpen: props.isOpen }"
  >
    <svg
      @click="emit('Close')"
      class="icon-close"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
    >
      <path
        d="M400 145.49L366.51 112L256 222.51L145.49 112L112 145.49L222.51 256L112 366.51L145.49 400L256 289.49L366.51 400L400 366.51L289.49 256L400 145.49z"
        fill="currentColor"
      ></path>
    </svg>
    <div class="select">
      <LewFormItem title="选择文件夹">
        <lew-select
          v-model="folder"
          :option="props.folders"
          label="name"
          value="name"
        ></lew-select
      ></LewFormItem>
    </div>

    <div class="upload-list">
      <label
        class="upload-box"
        :class="{
          dropActive: drop_active,
          uploadBoxLoading: loading_addupload,
        }"
      >
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
        >{{
          drop_active ? `松开鼠标上传文件` : `点击、拖拽、粘贴到此处上传文件`
        }}
        <input
          @change="ClickUpload"
          v-show="false"
          type="file"
          name="file"
          accept="image/*"
          multiple
        />
      </label>
      <div v-show="upload_list.length > 0" class="title-label">待上传图片</div>
      <div v-for="item in upload_list" :key="item.name" class="item">
        <div class="status-box">
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

        <div class="info">
          <div class="name">
            {{ `${item.name}_.jpeg` }}
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
    <div class="btn-box">
      <LewButton
        style="width: 220px"
        @click="upload_list = []"
        v-show="upload_list.length > 0"
        type="danger"
        >清空列表</LewButton
      >
      <LewButton
        @click="Upload(1)"
        type="warning"
        style="width: 220px"
        v-show="upload_list.length > 0"
        :loading="loading_btn == 1"
        >原图上传</LewButton
      >
      <LewButton
        @click="Upload(2)"
        v-show="upload_list.length > 0"
        type="primary"
        :loading="loading_btn == 2"
        >开始上传</LewButton
      >
    </div>

    <div v-show="history_list?.length > 0" class="upload-list">
      <div class="title-label">上传历史</div>
      <div v-for="item in history_list" :key="item.name" class="item">
        <div class="status-box">
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
        <div class="info">
          <div class="name">
            {{
              item?.upload_type == 1
                ? `${item.name}_${item.ext}`
                : `${item.name}_.jpeg`
            }}
          </div>
          <div class="tag-box">
            <span class="tag folder">{{ item.folder }}</span>
            <span class="tag orginal-size">{{
              GetFileSize(item.orginal_size)
            }}</span>
            <span class="tag compress-size">{{
              GetFileSize(item.compress_size)
            }}</span>

            <span
              v-if="item.download_url"
              v-bind:data-clipboard-text="GetMarkdownText(item.download_url)"
              @click="CopyText()"
              class="tag copy-btn"
              >markdown</span
            >

            <span
              v-if="item.download_url"
              v-bind:data-clipboard-text="GetCdnText(item.download_url)"
              @click="CopyText()"
              class="tag copy-btn"
              >cdn</span
            >
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
  left: 0px;
  z-index: 9;
  transform: translateX(-300px);
  width: 500px;
  height: 100vh;
  background: var(--background-2);
  border-right: var(--border-width) var(--border-color) solid;
  box-sizing: border-box;
  padding: 28px 14px;
  box-sizing: border-box;
  overflow-y: scroll;
  transition: all 0.25s;
  .btn-box {
    display: flex;

    button {
      margin-right: 7px;
    }
    button:last-child {
      margin-right: 0px;
    }
  }
  .icon-close {
    position: absolute;
    right: 0;
    top: 0;
    width: 24px;
    height: 24px;
    padding: 12px;
    opacity: 0.4;
    transform: scale(1);
    cursor: pointer;
    transition: all 0.15s;
  }
  .icon-close:hover {
    opacity: 0.8;
    transform: scale(1.2);
  }
  .icon-close:active {
    opacity: 1;
    transform: scale(1);
  }
  .upload-box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    width: 100%;
    color: #999;
    background: var(--background);
    margin: 10px 0px;
    border-radius: 12px;
    height: 200px;
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

  .upload-box::after {
    position: absolute;
    top: 50%;
    left: 50%;
    content: '';
    border: 4px solid rgba(194, 194, 194, 0.4);
    border-left-color: var(--primary-color);
    border-radius: 50%;
    width: 14px;
    height: 14px;
    opacity: 0;
    animation: donut-spin 0.8s linear infinite;
    transition: all 0.15s;
    transform: translate(-50%, -50%);
    outline: var(--background) solid 10000px;
    background: var(--background);
  }
  @keyframes donut-spin {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  .uploadBoxLoading::after {
    opacity: 1;
  }
  .dropActive {
    border: 3px dashed var(--primary-color);
    color: var(--primary-color);
    .upload-icon {
      color: var(--primary-color);
    }
  }
  .upload-box:hover {
    border: 3px dashed var(--primary-color);
    color: var(--primary-color);
    .upload-icon {
      color: var(--primary-color);
    }
  }
  .title-label {
    margin-bottom: 10px;
    margin-top: 30px;
  }

  .upload-list {
    .item {
      position: relative;
      display: flex;
      align-items: center;
      border-radius: 12px;
      background: var(--background);
      margin-bottom: 7px;
      width: 100%;
      height: 70px;
      box-sizing: border-box;
      border: var(--border-width) solid var(--border-color);
      padding: 10px;
      overflow: hidden;

      .status-box {
        position: absolute;
        top: 5px;
        right: 5px;
        .icon {
          width: 14px;
          height: 14px;
          border-radius: 30px;
          padding: 2px;
        }
        .icon-success {
          background: rgb(88, 212, 160);
          color: #fff;
        }
        .icon-fail {
          background: rgb(223, 118, 118);
          color: #fff;
        }
        .icon-uploading {
          background: rgb(45, 165, 212);
          color: #fff;
          animation: uploading 0.8s linear infinite;
        }
        @keyframes uploading {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }

      .image {
        width: 50px;
        height: 100%;
        object-fit: cover;
        border-radius: 7px;
        border: var(--border-width) solid var(--border-color);
      }

      .info {
        margin-right: 10px;
        margin-left: 3px;
        width: calc(100% - 70px);

        .name {
          position: relative;
          width: calc(100% - 20px);
          color: var(--text-color);
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .tag-box {
          margin-top: 10px;
          .tag {
            padding: 2px 4px;
            margin-right: 10px;
            background: var(--background-2);
            border-radius: 2px;
            font-size: 12px;
            color: var(--text-color);
          }
          .orginal-size {
            text-decoration: line-through;
            color: var(--text-color-2);
          }
          .compress-size {
            background: var(--primary-color);
            color: #fff;
          }

          .copy-btn:hover {
            background: var(--invert-background);
            color: var(--invert-text-color);
            cursor: pointer;
          }
        }
      }
    }
  }
}
.isOpen {
  transform: translateX(200px);
}
</style>
