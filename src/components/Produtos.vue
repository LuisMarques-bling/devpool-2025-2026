<template>
    <div class="produtos-container">
        <h2>Produtos</h2>

        <div class="botoes-container">
            <div class="filtros-busca">
                <input v-model="filtroNome" placeholder="Pesquisar por nome..." @keyup.enter="buscarProdutos(1)">
                <input v-model="filtroSKU" placeholder="SKU(Código)..." @keyup.enter="buscarProdutos(1)">
                <button @click="buscarProdutos(1)" class="btn-filtrar">Filtrar</button>
                <button @click="excluirSelecionados" class="btn-excluir">
                    <span class="material-icons">delete</span>
                    Excluir ({{ selecionados.length }})
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
                    <th><input type="checkbox" @change="alternarTodos" :checked="selecionados.length === produtos.length && produtos.length > 0"></th>
                    <th>#</th> <th>Nome</th>
                    <th>Código (SKU)</th>
                    <th>Unidade</th>
                    <th>Preço</th>
                    <th>Situação</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(produto, index) in produtos" :key="produto.id" class="produtos-table-container">
                    <td>
                        <input type="checkbox" :value="produto.id" :checked="selecionados.includes(produto.id)" @change="alternarSelecao(produto.id)">
                    </td>
                    <td>{{ (paginaAtual - 1) * 10 + (index + 1) }}</td>
                    <td>{{ produto.nome }}</td>
                    <td>{{ produto.codigo }}</td>
                    <td>{{ produto.unidade || 'Un' }}</td>
                    <td>R$ {{ produto.preco ? produto.preco.toFixed(2) : '0.00'}}</td>
                    <td :class="'status-' + produto.situacao.toUpperCase()"><span class="badge">
                    </span>{{ formatarSituacao(produto.situacao) }}</td>
                        
                </tr>
                <tr v-if="produtos.length === 0">
                    <td colspan="5" style="text-align: center;">Nenhum produto encontrado</td>
                </tr>
            </tbody>
        </table>

        <div class="paginacao">
            <button @click="paginaAnterior" :disabled="paginaAtual ===1 || carregando">&lt; Anterior</button>
            <span class="info-pagina">Página <strong>{{ paginaAtual }}</strong></span>
            <button @click="proximaPagina" :disabled="produtos.length < 10 || carregando">Próxima &gt;</button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '../stores/auth';
    import axios, { AxiosError } from 'axios';

    const authStore = useAuthStore();
    const router = useRouter();
    const produtos = ref<any[]>([]);
    const carregando = ref(false);
    const paginaAtual = ref(1);
    const filtroNome = ref('');
    const filtroSKU = ref('');

    const formatarSituacao = (status: string | number) =>{
        const s = String(status).toUpperCase();
        const mapa: Record<string, string> = {
            'A': 'Ativo',
            'I': 'Inativo',
            'E': 'Excluído',
            'P': 'Pendente'
        };
        return mapa[s] || 'Desconhecido';
    }

    const buscarProdutos = async(pagina = 1) => {
        carregando.value = true;
        try {
            const response = await axios.get('http://localhost:3000/api/produtos',{
                params:{
                    pagina: pagina,
                    nome: filtroNome.value,
                    codigo: filtroSKU.value
                },
                headers:{
                    'Authorization': `Bearer ${authStore.accessToken}`
                }
            });
            produtos.value = response.data.data || [];
            paginaAtual.value = pagina;
            window.scrollTo(0,0);
            console.log(`Página ${pagina} carregada:`, response.data);
        } catch (error) {
            const err = error as AxiosError;
            if (err.response?.status === 401){
                authStore.logout();
                router.push('/')
            }
            console.error("Erro ao buscar produtos:", error);
        } finally {
            carregando.value = false;
        }
    }
    const proximaPagina = () => buscarProdutos(paginaAtual.value + 1);
    const paginaAnterior = () => {
        if (paginaAtual.value > 1) buscarProdutos(paginaAtual.value - 1);
    }
    onMounted(() =>{
        buscarProdutos(1);
    })

    const cadastroProduto = () => router.push('/produtos/novo');

    const selecionados = ref<number[]>([]);

    const alternarSelecao = (id:number) => {
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
                    await axios.delete(`http://localhost:3000/api/produtos/${id}`,{
                        headers: { 'Authorization': `Bearer ${authStore.accessToken}`}
                    });
                }
                alert ('Produto(s) excluído(s) com sucesso');
                selecionados.value = [];
                buscarProdutos(paginaAtual.value);
            } catch (error: any){
                console.error ("Erro na exclusão:", error.response?.data);
                alert ('Alguns produtos não podem ser excluídos.')
            } finally {
                carregando.value = false;
            }
        }
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

.status-E{
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

.produtos-table-container:hover td{
    background-color: rgba(255, 255, 255, 0.3);
    transition: background 0.3 ease;
}

.btn-filtrar {
    cursor: pointer;
    background-color: var(--cor-primaria);
    color: var(--cor-texto);
    border: none;
    padding: 12px;
    border-radius: 5px;
    transition: filter 0.2s;
}

.btn-filtrar:hover {
    background-color: var(--cor-terciaria);
}

.produtos-table-container{
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
    gap: 1rem;
    flex: 1;
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
    background-color: rgb(28, 180, 28);
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
    background-color: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.btn-novo-produto .material-icons {
    font-size: 20px;
}

.produtos-table th:first-child, .produtos-table td:first-child {
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
    gap: 5px;
    font-weight: bold;
    transition: background 0.3s;
    margin-left: 1rem;
}

.btn-excluir:hover {
    background-color: #a50e0e;
}
</style>