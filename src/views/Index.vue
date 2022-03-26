<script setup lang="ts">
import { Alert } from '../util/alert'
import { GetFileSize, CopyText } from '../util/util'

import axios from '../axios/http'
import { onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
watch(
  () => route.query,
  (n: any) => {
    GetImage(n.folder)
  }
)

let images = ref([] as any)

onMounted(() => {
  GetImage(route.query.folder)
})

const GetImage = (folderPath) => {
  axios
    .get({
      url: `/repositories/474355047/contents/${
        folderPath || ''
      }?t=${new Date().getTime()}`,
    })
    .then((res: any) => {
      // res.forEach((e) => {
      //   if (e.download_url) {
      //     e.url = e.download_url.replace(
      //       'https://raw.githubusercontent.com',
      //       `https://cdn.jsdelivr.net/gh/${config.owner}/${config.selectedRepos}@${config.selectedBranch}/${content.path}`
      //     )
      //   }
      // })

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
}

const GetMarkdownText = (url) => {
  return `![03517ae2c7624a1e805bb7721ae2140d](${url})`
}
const GetHtmlText = (url) => {
  return `![03517ae2c7624a1e805bb7721ae2140d](${url})`
}
const GetCdnText = (url) => {
  return `![03517ae2c7624a1e805bb7721ae2140d](${url})`
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
</script>

<template>
  <!-- 图片列表 -->
  <div class="main">
    <div class="list">
      <div v-for="(item, index) in images" :key="index" class="item">
        <div class="del"></div>
        <a
          class="image"
          :data-info="FormatWImageInfo(item)"
          :href="item.download_url"
          data-fancybox="gallery"
        >
          <img :src="item.download_url" loading="lazy"
        /></a>
        <div class="info">
          <div class="name">{{ item.name }}</div>

          <div class="copy-box">
            <span
              class="copy-btn"
              v-bind:data-clipboard-text="GetMarkdownText(item.url)"
              @click="CopyText()"
              >markdown</span
            ><span
              class="copy-btn"
              v-bind:data-clipboard-text="GetCdnText(item.url)"
              @click="CopyText()"
              >cdn</span
            > 
            <span
              class="copy-btn"
              v-bind:data-clipboard-text="GetHtmlText(item.url)"
              @click="CopyText()"
              >html</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="footer">{{ images.length }} images</div>
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
.main {
  position: relative;
  width: calc(100vw - 200px);
  height: 100vh;
  overflow-y: auto;
  padding: 15px;
  box-sizing: border-box;
  .list {
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    list-style: none;
    padding-bottom: 45px;
    .item {
      position: relative;
      height: 0;
      padding-bottom: 100%;
      background: var(--background-2);
      margin-bottom: 0px;
      border-radius: 12px;
      border: 1px rgba(247, 245, 245, 0) solid;
      overflow: hidden;
      transition: all 0.1s;
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
          border: 1px var(--border-color) solid;
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 7px;
        }
      }
      .del {
        position: absolute;
        right: 5px;
        top: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 50px;
        background: rgba($color: #d34343, $alpha: 0.15);
        opacity: 0;
        transition: all 0.1s;
        border: 1px rgba($color: #d34343, $alpha: 0.25) solid;
      }
      .del::after {
        width: 12px;
        height: 2px;
        content: '';
        border-radius: 1px;
        background: rgba(190, 84, 84, 0.8);
      }
      .del:hover {
        background: rgba($color: #d34343, $alpha: 0.35);
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
            background: #eee;
            border: 1px var(--border-color) solid;
          }
          span:hover {
            border: 1px var(--invert-background) solid;
            background: var(--invert-background);
            color: var(--invert-text-color);
          }
        }
      }
    }
    .item:hover {
      border: 1px var(--border-color) solid;
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
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: calc(100% - 200px);
    margin-left: 200px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    color: var(--text-color-2);
    border-top: 1px var(--border-color) solid;
    background: var(--background);
  }
}
</style>
