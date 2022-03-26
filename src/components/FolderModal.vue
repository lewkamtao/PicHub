<script setup lang="ts">
import { Alert } from '../util/alert'
import axios from '../axios/http'
import { onMounted, reactive, ref, defineProps, defineEmits } from 'vue'

import { GithubConfig } from '../model/github_config.model'
let github_config: GithubConfig = JSON.parse(
  localStorage.getItem('github_config') as any
)

const props = defineProps({ isOpen: Boolean })
const emit = defineEmits(['close', 'updateFolderList'])
let forderName = ref('')

const AddForder = () => {
  axios
    .put({
      url: `/repos/${github_config.owner}/${github_config.repoPath}/contents/${forderName.value}/init
`,
      data: {
        message: 'feat:add a forder',
        content: '5q2k5paH5Lu255So5LqO5Yib5bu65paH5Lu25aS5',
      },
    })
    .then((res: any) => {
      Alert({
        type: 'success',
        text: '创建成功！',
      })
      forderName.value = ''
      emit('close')
      emit('updateFolderList')
    })
}
</script>

<template>
  <div class="folder-modal" :class="{ isOpen: props.isOpen }">
    <div class="form-item">
      <label>文件夹名称 </label>
      <input type="text" placeholder="请输入" v-model="forderName" />
    </div>
    <div class="form-item btn-box">
      <div @click="AddForder()" class="button">确认</div>
      <div @click="emit('close')" class="button button-danger">取消</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.folder-modal {
  position: absolute;
  left: -1px;
  bottom: 40px;
  width: 200px;
  height: 170px;
  background: var(--background-2);
  box-shadow: 220px 0px 220px rgba($color: #000, $alpha: 0.1);
  z-index: 9;
  opacity: 1;
  transition: all 0.25s;
  padding: 7px;
  box-sizing: border-box;
  border-top: 1px var(--border-color) solid;
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
