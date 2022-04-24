import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login'

const routes = [
  {
    path: '/Home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/BaseTable',
    name: 'BaseTable',
    component: () => import('@/views/dashboard/BaseTable.vue')
  },

  {
    path: '/resolver',
    name: 'resolver',
    component: () => import('@/views/dashboard/resolver.vue')
  },

  {
    path: '/BaseForm',
    name: 'BaseForm',
    component: () => import('@/views/dashboard/BaseForm.vue')
  },


  {
    path: '/studentIntroduce',
    name: 'studentIntroduce',
    component: () => import('@/views/dashboard/studentIntroduce.vue')
  },

  {
    path: '/JumpForm',
    name: 'JumpForm',
    component: () => import('@/views/dashboard/JumpForm.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
