<template>
    <div style = "padding: 100px; text-align: center;">
        <h1>Página de produtos</h1>
        <p> Se você está vendo isso, o roteamento funcionou!</p>
        <button @click="buscarProdutos">Testar Busca de Produtos</button>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '../stores/auth';
    import axios, { AxiosError } from 'axios';

    const authStore = useAuthStore();
    const router = useRouter();
    const produtos = ref<any[]>([]);

    const buscarProdutos = async() => {
        try {
            const response = await axios.get('http://localhost:3000/api/produtos',{
                headers:{
                    'Authorization': `Bearer ${authStore.accessToken}`
                }
            });
            produtos.value = response.data.data;
            console.log("Produtos carregados: ", response.data);
        } catch (error) {
            const err = error as AxiosError;
            if (err.response?.status === 401){
                authStore.logout();
                router.push('/')
            }
            console.error("Erro ao buscar produtos:", error);
        }
    }

</script>