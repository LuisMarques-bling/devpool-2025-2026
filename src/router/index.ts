import { createRouter, createWebHistory } from "vue-router";
import Callback from "../pages/Callback.vue";
import LandingPage from "../pages/LandingPage.vue";
import { useAuthStore } from "../stores/auth";



const routes = [
    {
        path:'/',
        name: 'home',
        component: LandingPage
    },
    {
        path:'/callback',
        name: 'callback',
        component: Callback
    },
    {
        path: '/produtos',
        name: 'produtos',
        component: () => import('../pages/Produtos.vue')
    },
    {
        path: '/produtos/novo',
        name:'cadastroProduto',
        component: () => import('../pages/CadastroProduto.vue')
    },
    {
        path: '/produtos/editar/:id',
        name: 'editarProduto',
        component: () => import('../pages/EditarProduto.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) =>{
    const authStore = useAuthStore();
    if (to.name === 'produtos' && !authStore.accessToken){
        next('/');
    } else {
        next();
    }
})

export default router;