<script setup lang="ts">
import { ref } from 'vue'
// 右键菜单
const menuStyle = ref<any>('')
const menuType = ref<any>('')

// 右键item菜单列表
function itemMenu(e, type) {
  menuType.value = type
  menuStyle.value = `left: ${e.pageX + 10}px;top:${e.pageY + 10}px;`
}
// 延时 防止关闭过快 影响点击事件视觉效果
function closeMenuBox() {
  setTimeout(() => {
    menuType.value = ''
  }, 100)
}
// 菜单指令
async function menuFn(type: String) {}
</script>

<template>
  <div class="photo" @contextmenu.prevent @click="closeMenuBox">
    <div class="menu-box" :style="menuStyle">
      <div v-show="menuType == 'blank'">
        <div class="item" @click="menuFn('refresh')">刷新</div>
        <div class="item" @click="menuFn('addFolder')">新建相册</div>

        <div class="item" @click="menuFn('upImage')">上传图片</div>
      </div>
      <div v-show="menuType == 'folder'" class="menu-box" :style="menuStyle">
        <div class="item" @click="menuFn('addFolder')">重命名</div>
        <div class="item" @click="menuFn('deleteFolder')">删除文件夹</div>

        <div class="item" @click="menuFn('openFolderDetail')">属性</div>
      </div>
      <div v-show="menuType == 'image'" class="menu-box" :style="menuStyle">
        <div class="item" @click="menuFn('copyGithubUrl')">
          复制 Github 链接
        </div>
        <div class="item" @click="menuFn('copyCDNUrl')">复制 CDN 链接</div>
        <div class="item" @click="menuFn('copyMarkdownGithubUrl')">
          复制 Markdown 格式 Github 链接
        </div>
        <div class="item" @click="menuFn('copyMarkdownCDNUrl')">
          复制 Markdown 格式 CDN 链接
        </div>
        <div class="item" @click="menuFn('deleteImage')">删除图片</div>
        <div class="item" @click="menuFn('openImageDetail')">属性</div>
      </div>
    </div>
    <div class="nav">
      <div class="add-button">+ 新建相册</div>
      <div class="list" @contextmenu.prevent.stop="itemMenu($event, 'blank')">
        <div
          v-for="(item, index) in new Array(30)"
          :key="`i` + index"
          class="item"
          @contextmenu.prevent.stop="itemMenu($event, 'folder')"
        >
          相册 {{ index }}
        </div>
      </div>
    </div>
    <div class="right" @contextmenu.prevent.stop="itemMenu($event, 'blank')">
      <div class="photo-box">
        <div class="upload-box">点击或拖拽图片到此处上传</div>
        <div class="list">
          <div
            v-for="(item, index) in new Array(50)"
            :key="`i` + index"
            v-show="index > 0"
            @contextmenu.prevent.stop="itemMenu($event, 'image')"
            class="item"
          >
            <div class="image">
              <a
                :href="`https://tngeek-mall-1255310647.cos.ap-guangzhou.myqcloud.com/public/images/pexels/${index}.jpg!blog_mainPic`"
                data-fancybox="gallery"
              >
                <img
                  :src="`https://tngeek-mall-1255310647.cos.ap-guangzhou.myqcloud.com/public/images/pexels/${index}.jpg!blog_mainPic`"
                  alt=""
                  srcset=""
              /></a>
            </div>
          </div>
        </div>
      </div>
      <div class="photo-info">
        <div class="title">图片信息</div>
        <div class="item">
          <div class="label">名称：</div>
          <div class="content">1231</div>
        </div>
        <div class="item">
          <div class="label">图片路径：</div>
          <div class="content">1231</div>
        </div>
        <div class="item">
          <div class="label">图片大小：</div>
          <div class="content">1231</div>
        </div>
        <div class="item">
          <div class="label">名称：</div>
          <div class="content">1231</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.photo {
  display: flex;
  height: calc(100vh - 50px);
  background: var(--background);

  .menu-box {
    min-width: 120px;
    position: fixed;
    z-index: 99;
    box-shadow: 0 1px 6px 0 rgb(32 33 36 / 28%);
    background: var(--background-1);
    color: var(--text-color);
    overflow: hidden;
    .item {
      line-height: 30px;
      padding: 5px 15px;
      cursor: pointer;
    }

    .item:hover {
      background: var(--background-hover);
    }
    .item:active {
      background: var(--background-active);
    }
  }

  .nav {
    width: 180px;
    height: calc(100vh - 50px);
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    box-shadow: var(--box-shadow);
    background: var(--background);
    color: var(--text-color-9);
    .add-button {
      position: sticky;
      top: 0px;
      width: 100%;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      cursor: pointer;
      background: var(--background-1);
      color: var(--text-color-9);
    }
    .add-button:hover {
      background: var(--background-hover);
      color: var(--text-color-8);
    }
    .add-button:active {
      background: var(--background-active);
      color: var(--text-color);
    }
    .list {
      width: 100%;
      background: var(--background);
      color: var(--text-color-6);
      .item {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 10px 20px;
        cursor: pointer;
      }
      .item:hover {
        background: var(--background-hover);
        color: var(--text-color);
      }
      .item:active {
        background: var(--background-active);
      }
    }
  }
  .right {
    width: calc(100% - 120px);
    height: calc(100vh - 50px);
    overflow-y: scroll;
    .photo-box {
      width: calc(100% - 350px);
    }
    .photo-info {
      position: fixed;
      padding: 80px 20px 20px 20px;
      box-sizing: border-box;
      right: 0px;
      top: 0px;
      height: 100vh;
      width: 350px;
      background: var(--background);
      box-shadow: var(--box-shadow);
      .title {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 50px;
      }
      .item {
        display: flex;
        margin-top: 20px;
        .label {
          width: 80px;
          text-align: right;
        }
        .content {
          width: calc(100% - 90px);
          margin-left: 10px;
        }
      }
    }
    .list {
      padding: 30px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 30px;

      .item {
        height: 120px;
        box-shadow: 0 1px 6px 0 rgb(32 33 36 / 28%);
        transition: all 0.1s;
        cursor: pointer;
        overflow: hidden;
        .image {
          width: 100%;
          height: 180px;

          img {
            object-fit: cover;
            width: 100%;
            height: 100%;
            opacity: 0.8;
          }
        }
      }
      .item:hover {
        box-shadow: var(--box-shadow-1);
        background: var(--background-hover);
        img {
          object-fit: cover;
          width: 100%;
          height: 100%;
          opacity: 1;
        }
      }
    }
  }
}
.upload-box {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-2);
  color: #999;
  font-size: 20px;
}

.upload-box:hover {
  background: var(--background-hover);
}
.upload-box:active {
  background: var(--background-active);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
