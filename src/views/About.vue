<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <div class="about-wrapper">
    <div class="title">关于</div>
    <div class="content">
      我是广州的前端工程师<a target="_blank" href="https://blog.kamtao.com/">
        Kamtao</a
      >。 我每天在 Left 广告初创公司构建大量前端、用户界面和
      API。到了周末，我会做很多有意思的项目。除了
      PicHUb，我还创建了一个有意思的论坛（<a
        target="_blank"
        href="https://fish.tngeek.com"
      >
        https://fish.tngeek.com</a
      >）。<br /><br />
      PicHub 是一个图床，也可以是相册，这取决于你对它的定位。<br />很简单，但比较完整，用
      Vue3 写的，不算太慢。<br />典型现代风格和干净页面，如果您和我一样对 UI
      极具苛刻，这将是一个让您大吃一惊的好项目。<br /><br />
      特别的是
      <ul>
        <li>支持点击、拖拽、复制图片上传</li>
        <li>
          谷歌 <a href="https://squoosh.app" target="_blank">squoosh</a>
          压缩图片
        </li>
        <li>
          <a href="https://fancyapps.com" target="_blank">Fancybox</a>
          的加持，让图片的预览效果更好。
        </li>
        <li>安全且快速，数据只存在本地。</li>
        <li>封装组件（按钮表单上传等）</li>
        <li>复制转换 Markdown 格式</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about-wrapper {
  max-width: 600px;
  margin: 70px auto;
  padding: 50px;
  .content {
    margin-top: 20px;
    line-height: 30px;
    a {
      color: var(--primary-color);
      text-decoration: underline;
    }
  }
}
</style>
