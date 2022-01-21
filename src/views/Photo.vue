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
        <div class="item" @click="menuFn('addFolder')">新建文件夹</div>
        <div class="item" @click="menuFn('upImage')">上传图片</div>
      </div>
      <div v-show="menuType == 'folder'" class="menu-box" :style="menuStyle">
        <div class="item" @click="menuFn('openFolder')">打开文件夹</div>
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
      <div class="upload-button">+ 新建文件夹</div>
      <div class="list" @contextmenu.prevent.stop="itemMenu($event, 'blank')">
        <div
          v-for="(item, index) in new Array(10)"
          :key="`i` + index"
          class="item"
          @contextmenu.prevent.stop="itemMenu($event, 'folder')"
        >
          相册 {{ index }}
        </div>
      </div>
    </div>
    <div class="right" @contextmenu.prevent.stop="itemMenu($event, 'blank')">
      <div class="upload-box">上传</div>
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
  </div>
</template>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.photo {
  display: flex;
  height: calc(100vh - 50px);

  .menu-box {
    min-width: 120px;
    position: fixed;
    z-index: 99;
    box-shadow: 0 1px 6px 0 rgb(32 33 36 / 28%);
    background: #fff;
    overflow: hidden;
    .item {
      line-height: 30px;
      padding: 5px 15px;
      cursor: pointer;
    }

    .item:hover {
      background: #eee;
    }
  }

  .nav {
    width: 180px;
    height: calc(100vh - 50px);
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    box-shadow: 0 1px 6px 0 rgb(32 33 36 / 28%);
    .upload-button {
      position: sticky;
      top: 0px;
      width: 100%;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba($color: #000000, $alpha: 0.05);
      font-size: 18px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .upload-button:hover {
      background: rgba($color: #000000, $alpha: 0.1);
    }
    .upload-button:active {
      background: rgba($color: #000000, $alpha: 0.2);
    }
    .list {
      width: 100%;
      .item {
        height: 40px;
        display: flex;
        align-items: center;
        padding: 10px 20px;
        cursor: pointer;
      }
      .item:hover {
        background: #eee;
      }
    }
  }
  .right {
    width: calc(100% - 120px);
    height: calc(100vh - 50px);
    overflow-y: scroll;
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
        box-shadow: 0 1px 6px 0 rgb(32 33 36 / 88%);
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
  padding: 30px 30px 0px 30px;
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
