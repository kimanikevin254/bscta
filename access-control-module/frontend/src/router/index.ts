import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProjectDetailsView from '@/views/ProjectDetailsView.vue'
import UsersView from '@/views/UsersView.vue'
import { hasPermission, isAuthenticated } from '@/lib/auth'
import type { Permission } from '@/types'
import NotFoundView from '@/views/NotFoundView.vue'
import AcceptInviteView from '@/views/AcceptInviteView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/accept-invite',
      name: 'accept-invite',
      component: AcceptInviteView,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
    },
    {
      path: '/dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/project/:projectId',
      component: ProjectDetailsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/users',
      component: UsersView,
      meta: { 
        requiresAuth: true,
        permissions: { resource: 'user', actions: ['READ'] } 
      },
    },

    // Catch-all route for 404 - Not Found
    {
      path: '/:catchAll(.*)', // This will match any route that is not defined
      component: NotFoundView,
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authenticated = to.meta.requiresAuth && isAuthenticated(); // Check if the user is authenticated

  // Check if the route requires authentication
  if (to.meta.requiresAuth && !authenticated) {
    next({ name: 'login' }); // Redirect to login if not authenticated
  } else if (to.meta.permissions) {
    // Check for permissions if defined in the route's meta
    const hasPerm = hasPermission(to.meta.permissions as Permission);
    if (!hasPerm) {
      router.back()
    } else {
      next(); // Proceed to the route if authenticated and has permissions
    }
  } else {
    next(); // Proceed to the route if no authentication or permissions required
  }
});


export default router
