import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/Home.vue'
import SplashScreen from '@/views/SplashScreen.vue'
//auth
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
//
import HomePage from '@/views/HomePage.vue'
import FirstAid from '@/views/FirstAid.vue'
import LiveTrack from '@/views/LiveTrack.vue'
import GuardianAlert from '@/views/GuardianAlert.vue'
import GuardianReport from '@/views/GuardianReport.vue'
import TrustedCircles from '@/views/TrustedCircles.vue'
import ZonalUpdates from '@/views/ZonalUpdates.vue'
//abilities
import PoliceDashboard from '@/views/PoliceDashboard.vue'
import AmbulanceDashboard from '@/views/AmbulanceDashboard.vue'
import FireServicesDashboard from '@/views/FireServicesDashboard.vue'
import Admin from '@/views/Admin.vue'
//Small confirmation Pages
import GrConfirmation from '@/views/GrConfirmation.vue'
//

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

        {
          path: '/GuardianReport',
          name: 'GuardianReport',
          component: GuardianReport,
        },
        {
          path: '/TrustedCircles',
          name: 'TrustedCircles',
          component: TrustedCircles,
        },
        {
          path: '/ZonalUpdates',
          name: 'ZonalUpdates',
          component: ZonalUpdates,
        },

        {
          path: '/PoliceDashboard',
          name: 'PoliceDashboard',
          component: PoliceDashboard,
        },
        {
          path: '/AmbulanceDashboard',
          name: 'AmbulanceDashboard',
          component: AmbulanceDashboard,
        },
        {
          path: '/FireServicesDashboard',
          name: 'FireServicesDashboard',
          component: FireServicesDashboard,
        },
        {
          path: '/Admin',
          name: 'Admin',
          component: Admin,
        },
        {
          path: '/GrConfirmation',
          name: 'GrConfirmation',
          component: GrConfirmation,
        },
      ],
    },
  ],
})

export default router
