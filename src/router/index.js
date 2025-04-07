import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/Home.vue'
import LandingPage from '@/views/LandingPage.vue'
import LoginPage from '@/views/LoginPage.vue'

import HomePage from '@/views/HomePage.vue'
import RegisterPage from '@/views/RegisterPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //i think it loads App.vue which is raw code(html css)
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage,
      meta: { hideNavbar: true }, //Hides the navbar
    },

    {
      path: '/LoginPage',
      name: 'LoginPage',
      component: LoginPage,
    },

    {
      path: '/RegisterPage',
      name: 'RegisterPage',
      component: RegisterPage,
    },
    //I think it loads Vue code pages and components(Home.vue)
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/HomePage',
          name: 'HomePage',
          component: HomePage,
        },
      ],
    },
  ],
})

export default router
