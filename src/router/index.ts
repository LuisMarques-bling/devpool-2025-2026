import { createRouter, createWebHistory } from "vue-router";
import Callback from "../components/Callback.vue";
import LandingPage from "../components/LandingPage.vue";
import Produtos from "../components/Produtos.vue";
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
        component: () => import('../components/Produtos.vue')
    },
    {
        path: '/produtos/novo',
        name:'cadastroProduto',
        component: () => import('../components/CadastroProduto.vue')
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