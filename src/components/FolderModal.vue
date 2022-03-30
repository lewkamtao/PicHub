<script setup lang="ts">
import { Alert } from '../util/alert'
import axios from '../axios/http'
import { ref } from 'vue'
import { LewButton, LewInput, LewFormItem } from '../components/base'

import { GithubConfig } from '../model/github_config.model'

// github 本地配置
let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

const props = defineProps({ isOpen: Boolean }) // 是否打开
const emit = defineEmits([
  'close', // 关闭文件夹
  'updateFolderList', // 更新文件夹列表
])

let forderName = ref('')
let loading = ref(false)

// 添加文件夹
const AddForder = () => {
  if (!github_config?.repoId) {
    Alert({
      type: 'danger',
      text: '请前往设置，完成配置信息',
    })
    return
  }
  loading.value = true
  axios
    .put({
      url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${forderName.value}/init
`,
      data: {
        message: 'add a forder',
        content: '5q2k5paH5Lu255So5LqO5Yib5bu65paH5Lu25aS5',
      },
    })
    .then((res: any) => {
      loading.value = false
      Alert({
        type: 'success',
        text: '创建成功！',
      })
      forderName.value = ''
      emit('close')
      emit('updateFolderList')
    })
    .catch(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="folder-modal" :class="{ isOpen: props.isOpen }">
    <lew-form-item title="文件名">
      <lew-input v-model="forderName" placeholder="请输入"></lew-input>
    </lew-form-item>
    <div class="form-item btn-box">
      <lew-button @click="AddForder()" type="primary" :loading="loading">
        确认
      </lew-button>
      <lew-button @click="emit('close')" type="danger">取消</lew-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.folder-modal {
  position: absolute;
  left: -1px;
  bottom: 40px;
  z-index: 9;
  width: 200px;
  height: 170px;
  background: var(--background-2);
  opacity: 1;
  padding: 7px;
  box-sizing: border-box;
  border-top: 1px var(--border-color) solid;
  transition: all 0.25s;
}
.isOpen {
  bottom: 200px;
  opacity: 1;
}

.form-item {
  margin-bottom: 6px;
}
.form-item:first-child {
  margin-top: 10px;
}
.btn-box {
  display: flex;
  .button:first-child {
    margin-right: 6px;
  }
}
</style>
