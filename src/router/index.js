import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/Home.vue'
import SplashScreen from '@/views/SplashScreen.vue'
// auth
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
// pages
import HomePage from '@/views/HomePage.vue'
import FirstAid from '@/views/FirstAid.vue'
import GuardianAlert from '@/views/GuardianAlert.vue'
import GuardianReport from '@/views/GuardianReport.vue'
import ZonalUpdates from '@/views/ZonalUpdates.vue'
// abilities
import PoliceDashboard from '@/views/PoliceDashboard.vue'
import PoliceDashboardSos from '@/views/PoliceDashboardSos.vue'
import AmbulanceDashboard from '@/views/AmbulanceDashboard.vue'
import FireServicesDashboard from '@/views/FireServicesDashboard.vue'
import Admin from '@/views/Admin.vue'
// Small confirmation Pages
import GrConfirmation from '@/views/GrConfirmation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'SplashScreen',
      component: SplashScreen,
      meta: { hideNavbar: true },
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/HomePage',
          name: 'HomePage',
          component: HomePage,
          meta: { requiresAuth: true },
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
          meta: { requiresAuth: true },
        },
        {
          path: '/GuardianAlert',
          name: 'GuardianAlert',
          component: GuardianAlert,
          meta: { requiresAuth: true },
        },
        {
          path: '/GuardianReport',
          name: 'GuardianReport',
          component: GuardianReport,
          meta: { requiresAuth: true },
        },
        {
          path: '/ZonalUpdates',
          name: 'ZonalUpdates',
          component: ZonalUpdates,
          meta: { requiresAuth: true },
        },
        {
          path: '/PoliceDashboard',
          name: 'PoliceDashboard',
          component: PoliceDashboard,
          meta: { requiresAuth: true },
        },
        {
          path: '/PoliceDashboardSos',
          name: 'PoliceDashboardSos',
          component: PoliceDashboardSos,
          meta: { requiresAuth: true },
        },
        {
          path: '/AmbulanceDashboard',
          name: 'AmbulanceDashboard',
          component: AmbulanceDashboard,
          meta: { requiresAuth: true },
        },
        {
          path: '/FireServicesDashboard',
          name: 'FireServicesDashboard',
          component: FireServicesDashboard,
          meta: { requiresAuth: true },
        },
        {
          path: '/Admin',
          name: 'Admin',
          component: Admin,
          meta: { requiresAuth: true },
        },
        {
          path: '/GrConfirmation',
          name: 'GrConfirmation',
          component: GrConfirmation,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthenticated = !!localStorage.getItem('token') // check 'token' in localStorage

  if (requiresAuth && !isAuthenticated) {
    next('/LoginPage') // Redirect unauthenticated users to login page
  } else {
    next() // Allow navigation
  }
})

export default router
