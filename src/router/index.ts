import { createRouter, createMemoryHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/CreateCharacter.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path:'/main',
    name:'gamemain',
    component:() => import('../views/GameMain.vue')
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createMemoryHistory(process.env.BASE_URL),
  routes
})

export default router
