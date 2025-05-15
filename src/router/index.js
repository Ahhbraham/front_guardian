import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/services/auth.service'

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
import Profile from '@/views/Profile.vue'
// Small confirmation Pages
import GrConfirmation from '@/views/GrConfirmation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'SplashScreen',
      component: SplashScreen,
      meta: { hideNavbar: true, requiresAuth: false },
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
          meta: {
            requiresAuth: true,
            allowedRoles: ['user', 'police', 'ambulance', 'fireservices', 'admin'],
          },
        },
        {
          path: '/Profile',
          name: 'Profile',
          component: Profile,
          meta: {
            requiresAuth: true,
            allowedRoles: ['user', 'police', 'ambulance', 'fireservices', 'admin'],
          },
        },
        {
          path: '/LoginPage',
          name: 'LoginPage',
          component: LoginPage,
          meta: { requiresAuth: false },
        },
        {
          path: '/RegisterPage',
          name: 'RegisterPage',
          component: RegisterPage,
          meta: { requiresAuth: false },
        },
        {
          path: '/FirstAid',
          name: 'FirstAid',
          component: FirstAid,
          meta: {
            requiresAuth: true,
            allowedRoles: ['user', 'police', 'ambulance', 'fireservices', 'admin'],
          },
        },
        {
          path: '/GuardianAlert',
          name: 'GuardianAlert',
          component: GuardianAlert,
          meta: {
            requiresAuth: true,
            allowedRoles: ['user', 'police', 'ambulance', 'fireservices', 'admin'],
          },
        },
        {
          path: '/GuardianReport',
          name: 'GuardianReport',
          component: GuardianReport,
          meta: {
            requiresAuth: true,
            allowedRoles: ['user', 'police', 'ambulance', 'fireservices', 'admin'],
          },
        },
        {
          path: '/ZonalUpdates',
          name: 'ZonalUpdates',
          component: ZonalUpdates,
          meta: {
            requiresAuth: true,
            allowedRoles: ['user', 'police', 'ambulance', 'fireservices', 'admin'],
          },
        },
        {
          path: '/PoliceDashboard',
          name: 'PoliceDashboard',
          component: PoliceDashboard,
          meta: { requiresAuth: true, allowedRoles: ['police', 'admin'] },
        },
        {
          path: '/PoliceDashboardSos',
          name: 'PoliceDashboardSos',
          component: PoliceDashboardSos,
          meta: { requiresAuth: true, allowedRoles: ['police', 'admin'] },
        },
        {
          path: '/AmbulanceDashboard',
          name: 'AmbulanceDashboard',
          component: AmbulanceDashboard,
          meta: { requiresAuth: true, allowedRoles: ['ambulance', 'admin'] },
        },
        {
          path: '/FireServicesDashboard',
          name: 'FireServicesDashboard',
          component: FireServicesDashboard,
          meta: { requiresAuth: true, allowedRoles: ['fireservices', 'admin'] },
        },
        {
          path: '/GrConfirmation',
          name: 'GrConfirmation',
          component: GrConfirmation,
          meta: {
            requiresAuth: true,
            allowedRoles: ['user', 'police', 'ambulance', 'fireservices', 'admin'],
          },
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated, user } = useAuth()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const allowedRoles = to.matched.reduce((roles, record) => {
    return record.meta.allowedRoles ? [...roles, ...record.meta.allowedRoles] : roles
  }, [])

  if (requiresAuth && !isAuthenticated.value) {
    next('/LoginPage') // Redirect unauthenticated users to login page
  } else if (
    requiresAuth &&
    allowedRoles.length &&
    !allowedRoles.includes(user.value?.role?.slug)
  ) {
    next('/HomePage') // Redirect users without the required role to HomePage
  } else {
    next() // Allow navigation
  }
})

export default router
