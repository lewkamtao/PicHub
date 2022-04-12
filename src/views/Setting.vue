<script setup lang="ts">
import { Alert } from '../util/alert'
import {
  LewButton,
  LewFormItem,
  LewSwitch,
  LewInput,
  LewSelect,
} from '../components/base'

import { GithubConfig } from '../model/github_config.model'

import axios from '../axios/http'
import { onMounted, reactive, ref } from 'vue'
onMounted(() => {
  if (!!localStorage.getItem('github_config')) {
    let github_config = JSON.parse(localStorage.getItem('github_config') as any)
    user.value = github_config
  } else {
    user.value.repoId = ''
  }
  if (!!localStorage.getItem('token')) {
    token.value = localStorage.getItem('token')

    GetUser()
  }
})

const repos = ref([] as any)
let user: any = ref({} as GithubConfig)
let token = ref('' as any)

let loading_1 = ref(false)
let loading_2 = ref(false)
let loading_3 = ref(false)
let loading_4 = ref(false)

const GetUser = () => {
  axios
    .get({
      url: `/user`,
    })
    .then((res: any) => {
      user.value.owner = res.data.login
      user.value.name = res.data.name
      user.value.avatarUrl = res.data.avatar_url
      localStorage.setItem('github_config', JSON.stringify(user.value))
      GetRepos()
    })
    .catch(() => {
      loading_1.value = false
      loading_4.value = false
    })
}

const SetToken = () => {
  localStorage.setItem('token', token.value)
  GetUser()
}

const GetRepos = () => {
  axios
    .get({
      url: `/users/${user.value.owner}/repos?type=public&sort=created&per_page=100`,
    })
    .then((res: any) => {
      repos.value = res.data
      loading_1.value = false

      if (
        !user.value.repoId &&
        token.value == 'ghp_nHrGvW63OTlLac' + '' + 'FH4WOHto6sYhS7yD1Us6Ta'
      ) {
        user.value.repoId = 480610843
        Save()
      }
    })
}

const Save = () => {
  if (!user.value.repoId) {
    Alert({
      type: 'warning',
      text: '请选择仓库',
    })
    return
  }
  loading_2.value = true
  user.value.repoPath = repos.value.find((e) => user.value.repoId == e.id).name
  localStorage.setItem('github_config', JSON.stringify(user.value))

  setTimeout(() => {
    Alert({
      type: 'success',
      text: '保存成功！',
    })
    loading_2.value = false
    location.reload()
  }, 500)
}

const Exit = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('github_config')
  localStorage.removeItem('history_list')

  loading_3.value = true
  Alert({
    type: 'success',
    text: '退出成功',
  })
  setTimeout(() => {
    loading_3.value = false
    location.reload()
  }, 500)
}

const changeDarkModel = (e) => {
  if (e.target.checked) {
    document.getElementsByTagName('html')[0].classList.add('dark')
  } else {
    document.getElementsByTagName('html')[0].classList.remove('dark')
  }
}
</script>

<template>
  <div class="form">
    <div v-if="!user.name" class="title-1">开始</div>
    <div v-show="user.name" class="user-info">
      <img class="avatar" :src="user.avatarUrl" alt="" srcset="" />
      <div class="name">{{ user.name }}</div>
    </div>
    <div class="form">
      <lew-form-item
        title="Github access token"
        small_title="如何获取？"
        small_title_link="https://juejin.cn/post/6989307240633073700"
        :tips="
          repos.length == 0
            ? `注意： <br />Pichub不会对你的 access token
          进行储存和转移，它只会储存在你的本机的浏览器内，所以它是相对安全的。如果你试图去浏览器的缓存中清除掉它，你会发现，它需要重新登陆了，但我们不推荐这样操作。
         `
            : ''
        "
      >
        <lew-input
          :disabled="repos.length > 0"
          v-model="token"
          placeholder="请输入"
        ></lew-input>
      </lew-form-item>

      <lew-form-item v-show="repos.length > 0" title="选择一个 Github 仓库">
        <lew-select
          v-model="user.repoId"
          :option="repos"
          label="name"
          value="id"
        ></lew-select>
      </lew-form-item>
    </div>

    <lew-form-item direction="row" v-show="repos.length > 0" title="暗黑模式">
      <lew-switch v-model="user.isDark" @change="changeDarkModel"></lew-switch>
    </lew-form-item>

    <lew-button
      type="primary"
      v-show="repos.length == 0"
      @click=";(loading_1 = true), SetToken()"
      :loading="loading_1"
    >
      确定
    </lew-button>
    <lew-button
      type="gray"
      v-show="repos.length == 0"
      @click="
        ;((loading_4 = true),
        (token = 'ghp_nHrGvW63OTlLac' + '' + 'FH4WOHto6sYhS7yD1Us6Ta')),
          SetToken()
      "
      :loading="loading_4"
    >
      少废话，先看东西。
    </lew-button>
    <lew-button
      type="primary"
      v-show="repos.length > 0"
      @click="Save()"
      :loading="loading_2"
    >
      保存配置
    </lew-button>
    <lew-button
      type="danger"
      v-show="repos.length > 0"
      @click="Exit()"
      :loading="loading_3"
    >
      退出登录
    </lew-button>
  </div>
</template>
<style></style>

<style lang="scss" scoped>
.form {
  width: 400px;
  margin: 0px auto;
}
.title-1 {
  margin-top: 120px;
  margin-bottom: 20px;
  color: var(--text-color-1);
  font-weight: bold;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 100px;
  margin-bottom: 20px;
  padding: 20px 0px;
  .avatar {
    width: 150px;
    border-radius: 50%;
    border: var(--border-width) var(--border-color) solid;
  }
  .name {
    margin-top: 5px;
    font-size: 18px;
    line-height: 32px;
    margin-left: 10px;
    color: var(--text-color);
  }
}

.token-demo {
  width: 100%;
  background-color: rgb(243, 255, 245);
  border-radius: 14px;
  margin-bottom: 20px;
  padding: 15px;
  line-height: 30px;
}
</style>
