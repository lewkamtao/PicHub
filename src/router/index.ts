import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Index from '../views/Index.vue'
import Setting from '../views/Setting.vue'
import About from '../views/About.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {},
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: {},
  },{
    path: '/About',
    name: 'About', 
    component: About,
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
