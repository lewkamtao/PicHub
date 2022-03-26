<script setup lang="ts">
import { Alert } from '../util/alert'
import { GetFileSize, CopyText } from '../util/util'
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

const GetUser = () => {
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
} 

const SetToken = () => {
  localStorage.setItem('token', token.value)

  GetUser()
}

const GetRepos = () => {
  axios
    .get({
      url: `/users/lewkamtao/repos?type=public&sort=created&per_page=100`,
    })
    .then((res: any) => {
      repos.value = res.data
    })
}

const Save = () => {
  if (!form.value.repoId) {
    Alert({
      type: 'warning',
      text: '请选择仓库',
    })
    return
  }
  form.value.repoPath = repos.value.find((e) => form.value.repoId == e.id).name
  localStorage.setItem('github_config', JSON.stringify(form.value))
  Alert({
    type: 'success',
    text: '保存成功！',
  })
  setTimeout(() => {
    location.reload()
  }, 500)
}

const Exit = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('github_config')
  Alert({
    type: 'success',
    text: '退出成功',
  })
  setTimeout(() => {
    location.reload()
  }, 500)
}
</script>

<template>
  <div class="main">
    <form>
      <div class="title">{{ token ? '设置' : '开始' }}</div>
      <div class="form-item">
        <label>access token </label>
        <input type="text" v-model="token" placeholder="请输入" />
      </div>
      <div class="form-item" v-show="repos.length > 0">
        <label>选择一个 Github 仓库 </label>
        <select name="" id="" v-model="form.repoId">
          <option value="" hidden>请选择</option>
          <option v-for="repo in repos" :value="repo.id" :key="repo.id">
            {{ repo.name }}
          </option>
        </select>
      </div>
      <div
        v-show="repos.length == 0"
        @click="SetToken()"
        class="form-item button button-center"
      >
        确定
      </div>
      <div
        v-show="repos.length > 0"
        @click="Save"
        class="form-item button button-center"
      >
        保存配置
      </div>
      <div
        v-show="repos.length > 0"
        @click="Exit()"
        class="item button button-center button-danger"
      >
        退出登录
      </div>
    </form>
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
  font-size: 30px;
  margin-top: 50px;
  margin-bottom: 20px;
  color: var(--text-color-1);
  font-weight: bold;
}
form {
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 450px;
  width: 450px;
}
</style>
