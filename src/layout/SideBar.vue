<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

watch(
  () => route.path,
  () => {
    data.active = route.path
  }
)
const paths = router.options.routes.filter((route) => route.name == 'Main')[0]
  .children

var data = reactive({
  active: '',
})

const to = (path: any) => {
  router.push(path)
}
onMounted(() => {
  data.active = route.path
})
</script>

<template>
  <div class="SideBar">
    <div class="logo"><img src="../assets/logo.png" alt="" srcset="" /></div>
    <div class="menu">
      <div
        class="item"
        v-for="(item, index) in paths"
        @click="to(item.path)"
        :key="index"
        :class="{ active: data.active == item.path }"
      >
        <div class="title">{{ item.meta.title }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SideBar {
  .logo {
    width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 40px;
    padding: 30px;
    box-sizing: border-box;
    img {
      width: 100%;
    }
  }
  .menu {
    width: 100%;
    margin-top: 100px;
    .item {
      height: 55px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.15s;
      letter-spacing: 3px;
    }
    .item:hover {
      background: var(--background-hover-2);
    }
    .item:active {
      background: var(--background-hover-2);
    }
    .title {
      position: relative;
    }
    .active {
      .title::after {
        content: '';
        position: absolute;
        left: -20px;
        top: 50%;
        width: 7px;
        height: 7px;
        border-radius: 50px;
        transform: translateY(-50%);
        background: #ff8f57;
      }
    }
  }
}
</style>
