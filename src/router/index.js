import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GuestView from '../views/GuestView.vue'
import WelcomeView from '../views/WelcomeView.vue'

const routes = [
  { path: '/',         name: 'home',    component: HomeView },
  { path: '/guest',    name: 'guest',   component: GuestView },
  { path: '/welcome',  name: 'welcome', component: WelcomeView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
