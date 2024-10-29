import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import RegisterView from '@/views/RegisterView.vue'
import LeadsView from '@/views/LeadsView.vue'
import CustomersView from '@/views/CustomersView.vue'
import InteractionsView from '@/views/InteractionsView.vue'
import { isAuthenticated } from '@/lib/auth'

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
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: LeadsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/customers',
      name: 'customers',
      component: CustomersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/interactions',
      name: 'interactions',
      component: InteractionsView,
      meta: { requiresAuth: true },
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
  } else {
    next(); // Proceed to the route if no authentication or permissions required
  }
});


export default router
