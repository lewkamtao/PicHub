<script setup lang="ts">
import { Alert } from '../util/alert'
import LewButton from '../components/base/LewButton.vue'
import { GithubConfig } from '../model/github_config.model'

import axios from '../axios/http'
import { onMounted, reactive, ref } from 'vue'
onMounted(() => {
  if (!!localStorage.getItem('github_config')) {
    let github_config = JSON.parse(localStorage.getItem('github_config') as any)
    form.value = github_config
  }
  if (!!localStorage.getItem('token')) {
    token.value = localStorage.getItem('token')
    GetUser()
  }
})

const repos = ref([] as any)
let form = ref({} as GithubConfig)
let token = ref('' as any)

let loading_1 = ref(false)
let loading_2 = ref(false)
let loading_3 = ref(false)

const GetUser = () => {
  loading_1.value = true
  axios
    .get({
      url: `/user`,
    })
    .then((res: any) => {
      form.value.owner = res.data.login
      form.value.name = res.data.name
      form.value.avatarUrl = res.data.avatar_url
      localStorage.setItem('github_config', JSON.stringify(form.value))
      GetRepos()
    })
    .catch(() => {
      loading_1.value = false
    })
}

const SetToken = () => {
  localStorage.setItem('token', token.value)
  GetUser()
}

const GetRepos = () => {
  axios
    .get({
      url: `/users/${form.value.owner}/repos?type=public&sort=created&per_page=100`,
    })
    .then((res: any) => {
      repos.value = res.data
      loading_1.value = false
    })
}

const Save = () => {
  loading_2.value = true
  if (!form.value.repoId) {
    Alert({
      type: 'warning',
      text: '请选择仓库',
    })
    return
  }
  form.value.repoPath = repos.value.find((e) => form.value.repoId == e.id).name
  localStorage.setItem('github_config', JSON.stringify(form.value))

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
</script>

<template>
  <div class="main">
    <div class="form">
      <div v-if="!token" class="title">开始</div>
      <div class="user-info">
        <img class="avatar" :src="form.avatarUrl" alt="" srcset="" />
        <div class="name">{{ form.name }}</div>
      </div>
      <div class="form-item">
        <label>Github access token </label>
        <input type="text" v-model="token" placeholder="请输入" />
      </div>
      <div class="form-item" v-show="repos.length > 0">
        <label>选择一个 Github 仓库 </label>
        <select v-model="form.repoId">
          <option value="" hidden>请选择</option>
          <option v-for="repo in repos" :value="repo.id" :key="repo.id">
            {{ repo.name }}
          </option>
        </select>
      </div>

      <lew-button
        type="primary"
        v-show="repos.length == 0"
        @click="SetToken()"
        :loading="loading_1"
      >
        确定
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
  </div>
</template>
<style></style>

<style lang="scss" scoped>
.main {
  width: 100%;
  background: var(--background-2);
  min-height: 100vh;
}
.title {
  margin-top: 50px;
  margin-bottom: 20px;
  color: var(--text-color-1);
  font-weight: bold;
}

.user-info {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  .avatar {
    width: 120px;
    border-radius: 50%;
    border: 1px var(--border-color) solid;
  }
  .name {
    margin-top: 5px;
    font-size: 18px;
    line-height: 32px;
    color: var(--text-color);
  }
}
</style>
