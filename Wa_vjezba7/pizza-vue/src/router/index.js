import { createRouter, createWebHistory } from 'vue-router'
import PizzaList from '../components/PizzaList.vue' 
import MyOrders from '../components/MyOrders.vue'


const routes = [
  {
    path: '/',
    name: 'PizzaList',
    component: PizzaList
  },
  {
    path: '/moje-narudzbe',
    name: 'MyOrders',
    component: MyOrders
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router