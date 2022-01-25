import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Main from '../layout/Main.vue'
import Index from '../views/Index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '/',
        name: 'Index',
        component: Index,
        meta: {
          title: '主页',
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
