<template>
    <div class="cadastro-container">
        <div class="header-acao">
            <button @click="voltar" class="btn-voltar">
                <span class="material-icons">arrow_back</span>
                Voltar
            </button>
            <h2>Cadastrar Novo Produto</h2>
        </div>

        <form @submit.prevent="salvarProduto" class="formulario-card">
            <div class="form-grid">
                <div class="campo">
                    <label>Nome do Produto <span class="obrigatorio">*</span></label>
                    <input v-model="produto.nome" type="text" placeholder="Nome do produto" :class="{'error-input': erros.nome}">
                    <span v-if="erros.nome" class="msg-erro">Nome é obrigatório</span>
                </div>
                <div class="campo">
                    <label>Código (SKU) <span class="obrigatorio">*</span></label>
                    <input v-model="produto.codigo" type="text" placeholder="Ex: P-001" :class="{'error-input': erros.codigo}">
                    <span v-if="erros.codigo" class="msg-erro">SKU é obrigatório</span>
                </div>
                <div class="campo">
                    <label>Preço de venda (R$) <span class="obrigatorio">*</span></label>
                    <input v-model.number="produto.preco" type="number" step="0.01" placeholder="0,00" :class="{'erro-input': erros.preco}">
                    <span v-if="erros.preco" class="msg-erro">Preço inválido</span>
                </div>
                <div class="campo">
                    <label> Unidade</label>
                    <input v-model="produto.unidade" type="text" placeholder="Ex: UN, KG, PC">
                </div>
                <div class="campo">
                    <label>Formato <span class="obrigatorio">*</span></label>
                    <select v-model="produto.formato">
                        <option value="S"> Simples</option>
                    </select>
                </div>
                <div class="campo">
                    <label>Tipo <span class="obrigatorio">*</span></label>
                    <select v-model="produto.tipo">
                        <option value="P">Produto</option>
                        <option value="S">Serviço</option>
                    </select>
                </div>
                <div class="campo">
                    <label>Situação <span class="obrigatorio">*</span></label>
                    <select v-model="produto.situacao">
                        <option value="A">Ativo</option>
                        <option value="I">Inativo</option>
                    </select>
                </div>
                <div class="campo campo-descricao">
                    <label>Descrição curta</label>
                    <input v-model="produto.descricaoCurta" type="textarea">
                </div>
            </div>

            <div class="acoes-form">
                <button type="submit" class="btn-salvar" :disabled="salvando">
                    <span class="material-icons">{{ salvando ? 'sync' : 'save' }}</span>
                    {{ salvando ? 'Salvando...' : 'Salvar' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ref, reactive } from 'vue';
import axios from 'axios';


    const router = useRouter();
    const authStore = useAuthStore();
    const salvando = ref(false);

    const produto = reactive ({
        nome: '',
        codigo: '',
        preco: null,
        unidade: '',
        situacao: 'A',
        tipo: 'P',
        formato: 'S',
        descricaoCurta: ''
    });

    const erros = reactive({
        nome: false,
        codigo: false,
        preco: false
    });

    const voltar = () => router.push('/produtos');

    const validarForm = () => {
        erros.nome = !produto.nome;
        erros.codigo = !produto.codigo;
        erros.preco = !produto.preco || produto.preco <= 0;
        return !erros.nome && !erros.codigo && !erros.preco;
    };

    const salvarProduto = async () => {
        if (!validarForm()) return;

        salvando.value = true;

        const enviandoProduto = {
            nome: produto.nome,
            codigo: produto.codigo,
            preco: produto.preco,
            tipo: produto.tipo,
            situacao: produto.situacao,
            formato: produto.formato,
            unidade: produto.unidade,
            descricaoCurta: produto.descricaoCurta
        }

        try {
            await axios.post('http://localhost:3000/api/produtos', enviandoProduto, {
                headers: { 'Authorization': `Bearer${authStore.accessToken}`}
            });
            alert('Produto cadastrado com sucesso!');
            router.push('/produtos');
        } catch (error){
            console.error('Erro ao salvar:', error);
            alert ('Erro ao cadastrar produto. Verifique se o SKU já existe.');
        } finally {
            salvando.value = false;
        }
    }
</script>

<style scoped>
.cadastro-container{
    padding: 2rem 4rem;
    background-color: var(--cor-secundaria);
    min-height: 87vh;
}

.header-acao{
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
}

.formulario-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: flex-start;
}

.campo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.campo-descricao {
    grid-column: span 2;
}

.campo label {
    font-weight: bold;
    color: var(--cor-primaria);
}

.campo input, .campo select {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
}

.erro input {
    border-color: #d93025 !important;
}

.msg-erro {
    color: #d93025;
    font-size: 0.8rem;
}

.acoes-form {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
}

.btn-salvar {
    background-color: #28a745;
    color: var(--cor-texto);
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
}

.btn-voltar {
    background: none;
    border: 1px solid var(--cor-primaria);
    color: var(--cor-primaria);
    padding: 8px 15px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
}

.obrigatorio {
    color: red
}
</style>