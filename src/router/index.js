import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NoticiaInterno from '../components/NoticiasInterno.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/NoticiasInterno/:id',
    name: 'NoticiasInterno',
    component: NoticiaInterno,
    props:true
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
