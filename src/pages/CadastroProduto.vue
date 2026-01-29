<template>
    <div class="cadastro-container">
        <ProdutoForm v-if="!salvando" :produto="produto" titulo="Cadastro de Produto" textoBotao="Salvar Produto"
            @voltar="voltar" @salvar="salvarProduto" @cancelar="cancelar" />
        <div v-else class="loading">Salvando...</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ref, reactive } from 'vue';
import axios from 'axios';
import ProdutoForm from '../components/forms/ProdutoForm.vue';
import { useProdutoStore } from '../stores/produtoStore';


const router = useRouter();
const authStore = useAuthStore();
const salvando = ref(false);
const produtoStore = useProdutoStore();

const produto = reactive({
    nome: '',
    codigo: '',
    preco: null,
    unidade: '',
    situacao: '',
    tipo: '',
    formato: '',
    descricaoCurta: ''
});

const voltar = () => router.push('/produtos');

const cancelar = () => router.push('/produtos')

const salvarProduto = async () => {
    
    try {
        await axios.post('http://localhost:3000/api/produtos', produto, {
            headers: { 'Authorization': `Bearer${authStore.accessToken}` }
        });

        produtoStore.resetFiltros();
        await produtoStore.buscarProdutos(1);

        alert('Produto cadastrado com sucesso!');
        router.push('/produtos');
    } catch (error) {
        alert('Erro ao cadastrar produto. Verifique se o SKU já existe.');
    } finally {
        salvando.value = false;
    }
}
</script>

