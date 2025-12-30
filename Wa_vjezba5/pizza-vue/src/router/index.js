import { createRouter, createWebHistory } from 'vue-router'
import PizzaList from '../components/PizzaList.vue' 

const routes = [
  {
    path: '/',
    name: 'PizzaList',
    component: PizzaList
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router