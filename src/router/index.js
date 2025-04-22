import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/Home.vue'
import SplashScreen from '@/views/SplashScreen.vue'
import LoginPage from '@/views/LoginPage.vue'

import HomePage from '@/views/HomePage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import FirstAid from '@/views/FirstAid.vue'
import LiveTrack from '@/views/LiveTrack.vue'
import GuardianAlert from '@/views/GuardianAlert.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //i think it loads App.vue which is raw code(html css)
    {
      path: '/',
      name: 'SplashScreen',
      component: SplashScreen,
      meta: { hideNavbar: true }, //Hides the navbar
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

        {
          path: '/FirstAid',
          name: 'FirstAid',
          component: FirstAid,
        },

        {
          path: '/LiveTrack',
          name: 'LiveTrack',
          component: LiveTrack,
        },

        {
          path: '/GuardianAlert',
          name: 'GuardianAlert',
          component: GuardianAlert,
        },
      ],
    },
  ],
})

export default router
