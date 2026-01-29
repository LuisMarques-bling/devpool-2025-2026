<template>
    <div class="cadastro-container">
        <ProdutoForm v-if="!carregando" :produto="produto" titulo="Editar Produto" textoBotao="Salvar Alterações"
            @voltar="voltar" @salvar="salvarEdicao" @cancelar="cancelar" />
        <div v-else class="loading">Carregando...</div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import ProdutoForm from '../components/forms/ProdutoForm.vue';
import { useProdutoStore } from '../stores/produtoStore';


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

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const carregando = ref(true);
const produtoStore = useProdutoStore();

onMounted(async () => {
    const id = route.params.id;
    try {
        const response = await axios.get(`http://localhost:3000/api/produtos/${id}`, {
            headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
        });

        const dadosBling = response.data.data;

        produto.nome = dadosBling.nome,
        produto.codigo = dadosBling.codigo,
        produto.preco = dadosBling.preco,
        produto.situacao = dadosBling.situacao,
        produto.unidade = dadosBling.unidade || 'un',
        produto.tipo = dadosBling.tipo,
        produto.formato = dadosBling.formato,
        produto.descricaoCurta = dadosBling.descricaoCurta || '',
        carregando.value = false;

    } catch (error: any) {
        alert("Não foi possível carregar os dados deste produto.");
        router.push('/produtos');
    } finally {
        carregando.value = false
    }
});

const salvarEdicao = async () => {
    try {
        const id = route.params.id;
        await axios.put(`http://localhost:3000/api/produtos/${id}`, produto, {
            headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
        });
        await produtoStore.buscarProdutos(1);

        alert('Produto atualizado com sucesso!');
        router.push('/produtos');
    } catch (error: any) {
        alert('Erro ao atualizar produto.')
    }
}

const voltar = () => router.push('/produtos');
const cancelar = () => router.push('/produtos')

</script>

