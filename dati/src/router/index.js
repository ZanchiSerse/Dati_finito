import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import GraficiView from '../views/GraficiView.vue';
import ComuniiView from '../views/ComuniiView.vue';
import GraficiiView from '../views/GraficiiView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  
  {
    path: '/grafici',
    name: 'grafici',
    component: GraficiView
  },
  {
    path: '/comunii',
    name: 'comunii',
    component: ComuniiView
  },
  
  {
    path: '/graficii',
    name: 'graficii',
    component: GraficiiView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
