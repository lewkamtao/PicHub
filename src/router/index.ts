import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

import Main from '../layout/Main.vue'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Photo from '../views/Photo.vue'
import Setting from '../views/Setting.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
          title: '主页',
        },
      },
      {
        path: '/Photo',
        name: 'Photo',
        component: Photo,
        meta: {
          title: '相册',
        },
      },
      {
        path: '/Setting',
        name: 'Setting',
        component: Setting,
        meta: {
          title: '设置',
        },
      },
      {
        path: '/About',
        name: 'About',
        component: About,
        meta: {
          title: '关于',
        },
      },
     
    ],
  },
]
const router = createRouter({
  history: createWebHashHistory(''),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})

export default router
