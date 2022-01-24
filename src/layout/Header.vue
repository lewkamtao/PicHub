<script setup lang="ts">
import { ref, onMounted } from 'vue'
const isDark: any = ref()
const setMode = (type) => {
  if (type == 'dark') {
    document.getElementsByTagName('html')[0].classList.add('dark')
    localStorage.setItem('isDark', '1')
  } else {
    localStorage.removeItem('isDark') 
    document.getElementsByTagName('html')[0].classList.remove('dark')
  }
  isDark.value = !isDark.value
}
onMounted(() => {
  if (localStorage.getItem('isDark')) {
    setMode('dark')
  } 
})
</script>

<template>
  <div class="header">
    <div class="mode">
      <div class="icon" @click="setMode('dark')" v-if="!isDark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24"
        >
          <path
            d="M20 8.69V4h-4.69L12 .69L8.69 4H4v4.69L.69 12L4 15.31V20h4.69L12 23.31L15.31 20H20v-4.69L23.31 12L20 8.69zm-2 5.79V18h-3.52L12 20.48L9.52 18H6v-3.52L3.52 12L6 9.52V6h3.52L12 3.52L14.48 6H18v3.52L20.48 12L18 14.48zM12 6.5c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5s5.5-2.47 5.5-5.5s-2.47-5.5-5.5-5.5zm0 9c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <div class="icon" @click="setMode('light')" v-if="isDark">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 24 24"
        >
          <path
            d="M10 4c4.41 0 8 3.59 8 8s-3.59 8-8 8c-.34 0-.68-.02-1.01-.07C10.9 17.77 12 14.95 12 12s-1.1-5.77-3.01-7.93C9.32 4.02 9.66 4 10 4m0-2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  box-shadow: 1px 3px 5px var(--shadow-key-ambient-opacity);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .mode {
    display: flex;
    margin-right: 50px;
    cursor: pointer;
  }
  .icon {
    transform: rotate(-230deg);
    width: 25px;
  }
}
</style>
