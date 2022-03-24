import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Index from '../views/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index', 
    component: Index,
    meta: {},
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
