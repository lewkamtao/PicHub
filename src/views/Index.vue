<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NModal, NButton, NFormItem, NInput, NForm } from 'naive-ui'

import cos from '../util/cos.js'
import util from '../util/util.js'

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
var showAddFolderModal = ref(false)
var ruleFolder = ref({
  name: {
    required: true,
    message: '请输入相册名称',
    trigger: ['blur', 'input'],
  },
})

var formFolder = ref({
  name: '',
})

const addFolder = () => {
  if (formFolder.value.name == '') {
    window.$message.error('请输入相册名称')
  } else {
    util
      .PUTFolder('/public/images/' + formFolder.value.name + '/')
      .then((res) => {
        formFolder.value.name = ''
        showAddFolderModal.value = false
        window.$message.success('新建成功')
        getCommonPrefixes()
      })
  }
}

const closeAddFolder = () => {
  formFolder.value.name = ''
  showAddFolderModal.value = false
}

var nowPrefix = ref('')
var NextMarker = ref('')
var isMore = ref(true)
var CommonPrefixes = ref([] as any)
var Contents = ref([] as any)

const getCommonPrefixes = () => {
  cos
    .GETObjects({ Prefix: 'public/images/', marker: '', pageSize: 120 })
    .then((res) => {
      CommonPrefixes.value = res.CommonPrefixes
      if (Contents.value.length == []) {
        getImages({
          Prefix: CommonPrefixes.value[0].Prefix,
          marker: '',
          type: 'new',
        })
      }
    })
}

const getImages = ({ Prefix, marker, type }: any) => {
  cos
    .GETObjects({
      Prefix: Prefix || 'public/images/',
      marker: marker || '',
      pageSize: 30,
    })
    .then((res) => {
      nowPrefix.value = res.Prefix
      NextMarker.value = res.NextMarker
      if (res.Contents.length < 30) {
        isMore.value = false
      } else {
        isMore.value = true
      }
      if (type == 'new') {
        Contents.value = res.Contents
      } else {
        Contents.value = Contents.value.concat(res.Contents)
      }
    })
}

const loadingMore = () => {
  getImages({
    Prefix: nowPrefix.value,
    marker: NextMarker.value,
  })
}

onMounted(() => {
  getCommonPrefixes()
})

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
    <div class="nav" @contextmenu.prevent.stop="itemMenu($event, 'image')">
      <div class="add-button" @click="showAddFolderModal = true">
        <svg
          style="width: 20px; margin-right: 5px"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24"
        >
          <path
            d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8z"
            fill="currentColor"
          ></path>
        </svg>
        新建相册
      </div>
      <n-modal
        class="custom-card"
        v-model:show="showAddFolderModal"
        preset="card"
        title="新建相册"
        size="huge"
        style="width: 500px"
        :bordered="false"
      >
        <template #header-extra></template>

        <n-form :rules="ruleFolder" :model="formFolder">
          <n-form-item label="相册名称" path="name">
            <n-input
              placeholder="输入相册名称"
              v-model:value="formFolder.name"
            /> </n-form-item
        ></n-form>
        <template #footer
          ><n-button @click="closeAddFolder">取消</n-button>
          <n-button style="margin-left: 10px" type="primary" @click="addFolder"
            >确定</n-button
          >
        </template>
      </n-modal>
      <div class="list">
        <div
          v-for="(item, index) in CommonPrefixes"
          :key="`i` + index"
          class="item"
          @contextmenu.prevent.stop="itemMenu($event, 'folder')"
          @click="getImages({ type: 'new', Prefix: item.Prefix })"
        >
          {{ item.Prefix.split('/')[item.Prefix.split('/').length - 2] }}
        </div>
      </div>
    </div>
    <div class="right" @contextmenu.prevent.stop="itemMenu($event, 'blank')">
      <div class="photo-box">
        <div class="list">
          <div
            v-for="(item, index) in Contents"
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
          <div
            v-for="(item, index) in new Array(20)"
            :key="`i` + index"
            class="blank"
          ></div>
        </div>
      </div>
      <div class="photo-info">
        <div class="title">点击此处或拖拽图片到此处上传</div>
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
    width: 220px;
    height: calc(100vh - 50px);
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    box-shadow: var(--box-shadow);
    background: var(--background);
    color: var(--text-color-9);
    z-index: 9;
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
      background: var(--background-2);
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
    background: var(--background-2);
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
    }
    .list {
      padding: 30px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 5px;

      .item {
        height: 130px;
        transition: all 0.1s;
        cursor: pointer;
        overflow: hidden;
        .image {
          width: 100%;
          img {
            object-fit: cover;
            width: 100%;
            height: 100%;
            opacity: 0.8;
          }
        }
      }
      .item:hover {
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
