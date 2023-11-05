import { createRouter, createWebHistory } from 'vue-router';
import { catalogPages } from './catalog.pages';
import { registrationPages } from './registration.pages';

const routes = [
  /* Functional Pages */
  {
    path: '/',
    name: 'main',
    component: () => import('@/pages/MainPage'),
  },
  {
    path: '/search',
    component: () => import('@/pages/SearchPage'),
    name: "search-page",
  },
  {
    path: '/cart',
    component: () => import('@/pages/CartPage'),
    name: "cart",
  },
  {
    path: '/profile',
    component: () => import('@/pages/ProfilePage'),
    name: 'profile-page',
  },
  {
    path: '/wishlist',
    component: () => import('@/pages/WishlistPage'),
    name: 'wishlist',
  },
  {
    path: '/history',
    component: () => import('@/pages/HistoryPage'),
    name: 'history',
  },

  /* Info Pages */
  {
    path: '/contacts',
    component: () => import('@/pages/ContactsPage'),
    name: "contacts",
  },
  // about
  // order

  /* Registration */
  ...registrationPages,

  /* Catalog */
  ...catalogPages,
]

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})

export default router
