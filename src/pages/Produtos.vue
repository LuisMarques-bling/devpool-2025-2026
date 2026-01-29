<template>
    <div class="produtos-container">
        <h2>Produtos</h2>

        <div class="botoes-container">
            <div class="filtros-busca">

                <select v-model="filtros.situacao" class="select-situacao">
                    <option value="U">Últimos incluídos</option>
                    <option value="A">Ativos</option>
                    <option value="I">Inativos</option>
                    <option value="E">Excluidos</option>
                    <option value="T">Todos</option>
                </select>
                <input v-model="filtros.pesquisa" class="input-filtro search-input"
                    placeholder="Pesquisar por nome ou SKU..." @keyup.enter="store.buscarProdutos(1)">
                <div class="grupo-data">
                    <label> Alterado de:</label>
                    <input type="date" v-model="filtros.dataInicio" class="input-data">
                    <label>até:</label>
                    <input type="date" v-model="filtros.dataFim" class="input-data">
                </div>
                <button @click="handleFiltrar" class="btn-filtrar">Filtrar</button>
            </div>
            <div>
                <button @click="excluirSelecionados" class="btn-excluir" :disabled="selecionados.length === 0"
                    :title="selecionados.length === 0 ? 'Selecione ao menos um produto' : 'Excluir Seleciondos'">
                    <span class="material-icons">delete</span>
                </button>
            </div>
            <div class="btn-novo-produto" @click="cadastroProduto">
                <span class="material-icons">add</span>
                Adicionar Produto
            </div>
        </div>

        <div v-if="carregando" class="loading"> Carregando produtos...</div>

        <table v-else class="produtos-table">
            <thead>
                <tr>
                    <th><input type="checkbox" @change="alternarTodos"
                            :checked="selecionados.length === produtos.length && produtos.length > 0"></th>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Código (SKU)</th>
                    <th>Unidade</th>
                    <th>Preço</th>
                    <th>Situação</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(produto, index) in produtos" :key="produto.id" class="produtos-table-container">
                    <td>
                        <input type="checkbox" :value="produto.id" :checked="selecionados.includes(produto.id)"
                            @change="alternarSelecao(produto.id)">
                    </td>
                    <td>{{ (store.filtros.pagina - 1) * 10 + (index + 1) }}</td>
                    <td>{{ produto.nome }}</td>
                    <td>{{ produto.codigo }}</td>
                    <td>{{ produto.unidade || 'Un' }}</td>
                    <td>R$ {{ produto.preco ? produto.preco.toFixed(2) : '0.00' }}</td>
                    <td :class="'status-' + produto.situacao.toUpperCase()"><span class="badge">
                        </span>{{ formatarSituacao(produto.situacao) }}</td>
                    <td>
                        <button @click="editarProduto(produto.id)" class="btn-editar">
                            <span class="material-icons">edit</span>
                        </button>
                    </td>
                </tr>
                <tr v-if="produtos.length === 0">
                    <td colspan="5" style="text-align: center;">Nenhum produto encontrado</td>
                </tr>
            </tbody>
        </table>

        <div class="paginacao">
            <span class="info-pagina">Página <strong>{{ store.filtros.pagina }}</strong></span>
            <div class="paginas">
                <button @click="paginaAnterior" :disabled="store.filtros.pagina === 1 || store.carregando">&lt;
                    Anterior</button>
                <button @click="proximaPagina" :disabled="!store.temMais || store.carregando" :class="{ 'botao-desabilitado': !store.temMais}">{{store.carregando ? 'Buscando...' : 'Próxima'}}&gt;</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';
import { useProdutoStore } from '../stores/produtoStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const router = useRouter();
const paginaAtual = ref(1);
const store = useProdutoStore();
const { filtros, produtos, carregando, temMais } = storeToRefs(store)


const formatarSituacao = (status: string | number) => {
    const s = String(status).toUpperCase();
    const mapa: Record<string, string> = {
        'A': 'Ativo',
        'I': 'Inativo',
        'E': 'Excluído',
        'T': 'Todos',
        'U': 'Ultimos incluídos'
    };
    return mapa[s] || 'Desconhecido';
}

onMounted( async () => {
    if (store.produtos.length === 0) {
        await store.buscarProdutos();
    }
});

const handleFiltrar = async () => {
    try {
        await store.buscarProdutos(1);
    } catch (e) {
        alert('Erro ao filtrar produtos')
    }
    if ((filtros.value.dataInicio || filtros.value.dataFim)) {
        if (!filtros.value.dataInicio || !filtros.value.dataFim) {
            alert("Para filtrar por data, preencha o período completo (Início e Fim).");
            carregando.value = false;
            store.resetFiltros();
            store.buscarProdutos(1);

            return
        }
        if (new Date(filtros.value.dataInicio) > new Date(filtros.value.dataFim)) {
            alert('A data inicial não pode ser maior que a data final.');
            carregando.value = false;
            store.resetFiltros();
            store.buscarProdutos(1);
            return
        }
        await store.buscarProdutos(1);
    }
    window.scrollTo(0, 0);
};

const proximaPagina = async () => {
    store.filtros.pagina++;
    await store.buscarProdutos()
};

const paginaAnterior = async () => {
    if (store.filtros.pagina > 1) {
        store.filtros.pagina--;
        await store.buscarProdutos()
    }
}

const cadastroProduto = () => router.push('/produtos/novo');

const selecionados = ref<number[]>([]);

const alternarSelecao = (id: number) => {
    const index = selecionados.value.indexOf(id);
    if (index > -1) {
        selecionados.value.splice(index, 1);
    } else {
        selecionados.value.push(id);
    }
};

const alternarTodos = () => {
    if (selecionados.value.length === produtos.value.length) {
        selecionados.value = [];
    } else {
        selecionados.value = produtos.value.map(p => p.id);
    }
}

const excluirSelecionados = async () => {
    if (selecionados.value.length === 0) return;

    if (confirm(`Deseja excluir ${selecionados.value.length} produto(s)?`)) {
        carregando.value = true;

        try {
            for (const id of selecionados.value) {
                await axios.delete(`http://localhost:3000/api/produtos/${id}`, {
                    headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
                });
            }
            alert('Produto(s) excluído(s) com sucesso');
            selecionados.value = [];
            store.buscarProdutos(paginaAtual.value);
        } catch (error: any) {
            console.error("Erro na exclusão:", error.response?.data);
            alert('Alguns produtos não podem ser excluídos.')
        } finally {
            carregando.value = false;
        }
    }
}

const editarProduto = (id: number) => {
    router.push(`/produtos/editar/${id}`)
}

</script>

<style scoped>
.badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
    display: inline-block;
}

.status-A {
    background-color: #e6f4ea;
    color: #208137;
    padding: 2px 5px;
    border-radius: 15px;
}

.status-I {
    background-color: #feecef;
    color: #d93025;
    padding: 2px 5px;
    border-radius: 15px;
}

.status-E {
    background-color: #f8d7da;
    color: #721c24;
    padding: 2px 5px;
    border-radius: 15px;
}

.produtos-container {
    background-color: var(--cor-secundaria);
    padding: 2rem 4rem;
    min-height: 87vh;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.produtos-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 5px;
    margin-top: 1.5rem;
    color: var(--cor-primaria);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

.produtos-table th {
    padding: 15px;
    color: var(--cor-texto);
    text-align: left;
    font-size: 1.1rem;
    border-bottom: 2px solid var(--cor-primaria);
}

.produtos-table-container:hover td {
    background-color: rgba(255, 255, 255, 0.3);
    transition: background 0.3 ease;
}

.btn-filtrar {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    background-color: var(--cor-terciaria);
    color: var(--cor-texto);
    border: none;
    padding: 0 20px;
    border-radius: 5px;
    transition: background 0.2s;
}

.btn-filtrar:hover {
    background-color: var(--cor-primaria);
}

.produtos-table-container {
    border: 1px solid var(--cor-primaria);
    padding: 1rem;
}

.produtos-table-container td {
    padding: 22px 15px;
    background-color: rgba(255, 255, 255, 0.05);
    vertical-align: middle;
    font-size: 1rem;
    line-height: 1.5;
}

.botoes-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
    width: 100%;
}

.filtros-busca {
    display: flex;
    width: 70%;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    background: var(--cor-secundaria);
    padding: 10px;
    border-radius: 10px;
    border: 1px solid var(--cor-primaria);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.filtros-busca input {
    width: 20%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--cor-primaria);
    font-size: 0.9rem;
}

.btn-novo-produto {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: var(--cor-terciaria);
    color: var(--cor-texto);
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.btn-novo-produto:hover {
    background-color: #17b138;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn-novo-produto .material-icons {
    font-size: 20px;
}

.produtos-table th:first-child,
.produtos-table td:first-child {
    width: 50px;
    text-align: center;
    color: var(--cor-terciaria);
    font-weight: bold;
}

.btn-excluir {
    background-color: #d93025;
    color: var(--cor-texto);
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.3s;
    margin-top: 0;
}

.btn-excluir:hover {
    background-color: #a50e0e;
}

.paginacao {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.select-situacao,
.search-input,
.input-data,
.btn-filtrar {
    height: 2rem;
    border-radius: 6px;
    border: 1px solid var(--cor-texto);
    font-size: 14px;
    outline: none;
}

.select-situacao {
    width: 13%;
    border: 1px solid var(--cor-primaria);
    margin-top: 0;
    padding: 0;
}

.search-input {
    flex: 1;
    min-width: 200px;
    padding-left: 10px;
}

.grupo-data {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    color: var(--cor-primaria);
    font-size: 13px;
    font-weight: 500;
}

.input-data {
    padding: 5px;
    cursor: pointer;
}

.btn-excluir:disabled {
    background-color: #e0e0e0;
    color: #9e9e9e;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.btn-excluir:disabled:hover {
    background-color: #e0e0e0;
    transform: none;
}

.paginas button {
    background-color: var(--cor-terciaria);
    color: var(--cor-texto);
}

.btn-editar {
    background-color: var(--cor-terciaria);
    color: var(--cor-texto);
    margin-top: 0;
}
</style>