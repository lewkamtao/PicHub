<script setup lang="ts">
import { Alert } from '../util/alert'
import { GetFileSize, CopyText } from '../util/util'
import { GithubConfig } from '../model/github_config.model'
import LewButton from '../components/base/LewButton.vue'

import axios from '../axios/http'
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits(['SetLoading', 'OpenUploadModel'])

const route = useRoute()
const router = useRouter()

watch(
  () => route.query,
  (n: any) => {
    if (n.folder) {
      GetImages(n.folder)
    }
  }
)

let images = ref([] as any)
let files = ref([] as any)

onMounted(() => {
  if (github_config?.owner) {
    GetImages(route.query.folder)
  } else {
    router.push('/setting')
  }
})

let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

const GetImages = (folderPath) => {
  emit('SetLoading', true)
  axios
    .get({
      url: `/repositories/${github_config?.repoId}/contents/${
        folderPath || ''
      }?t=${new Date().getTime()}`,
    })
    .then((res: any) => {
      files.value = res.data
      emit('SetLoading', false)
      res.data.forEach((e) => {
        if (e.download_url) {
          e.cdn_url = `https://git.pink/${github_config.owner}/${github_config.repoPath}/blob/main/${folderPath}/${e.name}?raw=true`
        }
      })

      function isAssetTypeAnImage(name) {
        // 获取最后一个.的位置
        var index = name.lastIndexOf('.')
        // 获取后缀
        var ext = name.substr(index + 1)
        return (
          [
            'png',
            'jpg',
            'jpeg',
            'bmp',
            'gif',
            'webp',
            'psd',
            'svg',
            'tiff',
          ].indexOf(ext.toLowerCase()) >= 0
        )
      }
      images.value = res.data.filter((e) => isAssetTypeAnImage(e.name))
    })
    .catch(() => {
      emit('SetLoading', false)
    })
}

const GetMarkdownText = (url) => {
  var alt = url.substring(url.lastIndexOf('/') + 1)
  return `![${alt}](${url})`
}

const GetCdnText = (url) => {
  return ` ${url}`
}

let loading = ref(false)
const DeleteForder = () => {
  if (files.value[0]?.name == 'init') {
    loading.value = true
    axios
      .delete({
        url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${route.query.folder}/init`,
        data: {
          message: 'delete init file',
          sha: files.value[0]?.sha,
        },
      })
      .then(() => {
        Alert({
          type: 'success',
          text: '删除成功',
        })
        loading.value = false
        router.push('/?reload=true')
      })
  } else {
    Alert({
      type: 'success',
      text: '该文件夹内有其他文件，请先登录Github中删除所有文件。',
    })
  }
}

const DeleteImage = (item) => {
  emit('SetLoading', true)
  axios
    .delete({
      url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${route.query.folder}/${item.name}`,
      data: {
        message: 'delete a image',
        sha: item.sha,
      },
    })
    .then(() => {
      Alert({
        type: 'success',
        text: '删除成功',
      })
      GetImages(route.query.folder)
    })
    .catch(() => {
      emit('SetLoading', false)
    })
}

const FormatWImageInfo = (image) => {
  return `
    <div class="image-info">
    <div class="item"><span>名称</span><div>${image.name}</div></div>
    <div class="item"><span>大小</span><div>${GetFileSize(
      image.size
    )}</div></div>
    <div class="item"><span>url</span><div>${image.url}</div></div>
    <div class="item"><span>html_url</span><div>${image.html_url}</div></div>
    <div class="item"><span>git_url</span><div>${image.git_url}</div></div>
    <div class="item"><span>download_url</span><div>${
      image.download_url
    }</div> </div>
  `
}

defineExpose({
  GetImages,
})
</script>

<template>
  <!-- 图片列表 -->
  <div class="index-wrapper">
    <div v-show="images.length == 0" class="not-found">
      <div class="title">无图片</div>
      <div class="message">你可以在左侧栏底部上传图片。</div>
      <div style="margin-top: 10px">
        <LewButton
          @click="emit('OpenUploadModel')"
          type="primary"
          style="width: 120px; margin: 10px auto"
          >上传图片</LewButton
        >
        <LewButton
          @click="DeleteForder"
          type="danger"
          :loading="loading"
          style="width: 120px; margin: 0 auto"
          >删除文件夹</LewButton
        >
      </div>
    </div>

    <div v-show="images.length > 0" class="list">
      <div v-for="item in images" :key="`${item.name}`" class="item">
        <div @click="DeleteImage(item)" class="del"></div>
        <a
          class="image"
          :data-info="FormatWImageInfo(item)"
          :href="item.cdn_url"
          data-fancybox="gallery"
        >
          <img :src="item.cdn_url" loading="lazy"
        /></a>
        <div class="info">
          <div class="name">{{ item.name }}</div>

          <div class="copy-box">
            <span
              class="copy-btn"
              v-bind:data-clipboard-text="GetMarkdownText(item.cdn_url)"
              @click="CopyText()"
              >markdown</span
            ><span
              class="copy-btn"
              v-bind:data-clipboard-text="GetCdnText(item.cdn_url)"
              @click="CopyText()"
              >cdn</span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="images.length > 0" class="footer">
      {{ images.length }} images
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
.index-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-y: auto;

  box-sizing: border-box;
  .list {
    display: grid;
    align-content: flex-start;
    padding: 15px;
    grid-gap: 15px;
    min-height: calc(100vh - 73px);
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    list-style: none;
    .item {
      position: relative;
      height: 0;
      padding-bottom: 100%;
      background: var(--background-2);
      margin-bottom: 0px;
      border-radius: 12px;
      border: var(--border-width) rgba(247, 245, 245, 0) solid;
      overflow: hidden;
      cursor: pointer;
      .name {
        width: 80%;
        margin: 0 auto;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .image {
        position: absolute;
        left: 50%;
        top: calc(50% - 10px);
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        max-width: 110px;
        max-height: 110px;
        width: 110px;
        transition: all 0.1s;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 4px;
        }
      }
      .del {
        position: absolute;
        left: 5px;
        top: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 50px;
        background: rgba($color: #d34343, $alpha: 0.25);
        opacity: 0;
        transition: all 0.1s;
        border: var(--border-width) rgba($color: #d34343, $alpha: 0.25) solid;
      }
      .del::after {
        width: 12px;
        height: 2px;
        content: '';
        border-radius: var(--border-width);
        background: rgba(175, 71, 71, 0.8);
      }
      .del:hover {
        background: rgba($color: #d34343, $alpha: 0.55);
      }
      .del:hover::after {
        background: rgba(190, 84, 84, 1);
      }
      .info {
        position: absolute;
        left: 0px;
        bottom: 0px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        transition: all 0.1s;
        width: 100%;
        font-size: 13px;
        color: var(--text-color-2);
        .copy-box {
          display: none;
          height: 40px;
          opacity: 0;
          transition: all 0.1s;
          span {
            padding: 2px 6px;
            border-radius: 4px;
            margin: 0px 3px;
            height: 20px;
            line-height: 20px;
            background: var(--background-3);
            border: var(--border-width) var(--border-color) solid;
          }
          span:hover {
            border: var(--border-width) var(--invert-background) solid;
            background: var(--invert-background);
            color: var(--invert-text-color);
          }
        }
      }
    }
    .item:hover {
      border: var(--border-width) var(--border-color) solid;
      .image {
        top: calc(50% - 20px);
      }
      .name {
        display: none;
      }
      .copy-box {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 1;
      }
      .info {
        height: 40px;
        background-color: var(--background);
        color: var(--text-color);
      }
      .del {
        opacity: 1;
      }
    }
  }
  .footer {
    position: sticky;
    bottom: 0px;
    right: 0px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    color: var(--text-color-2);
    border-top: var(--border-width) var(--border-color) solid;
    background: var(--background);
    opacity: 0.7;
  }
  .not-found {
    position: absolute;

    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--text-color-2);
    text-align: center;
    .title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .message {
      font-size: 16px;
      margin-bottom: 55px;
    }
  }
}
</style>
