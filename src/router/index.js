import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Home',
  component: Home
},
{
  path: '/about',
  name: 'About',
  component: () => import('../views/About.vue')
},
{
  path: '/login',
  name: 'Login',
  component: () => import('../views/Login.vue')
},
{
  path: '/personal',
  name: 'Personal',
  component: () => import('../views/Personal.vue')
},
{
  path: '/site',
  name: 'Site',
  component: () => import('../views/Site.vue')
},
{
  path: '/hotel',
  name: 'Hotel',
  component: () => import('../views/Hotel.vue')
},
{
  path: '/announcement',
  name: 'Announcement',
  component: () => import('../views/Announcement.vue')
},
{
  path: '/manage',
  name: 'Manage',
  component: () => import('../views/Manage.vue')
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
