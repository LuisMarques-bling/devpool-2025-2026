<template>
    <div class="cadastro-container">
        <div class="header-acao">
            <button @click="$emit('voltar')" class="btn-voltar">
                <span class="material-icons">arrow_back</span>
                Voltar
            </button>
            <h2>{{ titulo }}</h2>
        </div>

        <form @submit.prevent="salvar" class="formulario-card">
            <div class="form-grid">
                <div class="campo">
                    <label>Nome do Produto <span class="obrigatorio">*</span></label>
                    <input v-model="produto.nome" type="text" placeholder="Nome do produto"
                        :class="{ 'error-input': erros.nome }">
                    <span v-if="erros.nome" class="msg-erro">Nome é obrigatório</span>
                </div>
                <div class="campo">
                    <label>Código (SKU) <span class="obrigatorio">*</span></label>
                    <input v-model="produto.codigo" type="text" placeholder="Ex: P-001"
                        :class="{ 'error-input': erros.codigo }">
                    <span v-if="erros.codigo" class="msg-erro">SKU é obrigatório</span>
                </div>
                <div class="campo">
                    <label>Preço de venda (R$) <span class="obrigatorio">*</span></label>
                    <input v-model.number="produto.preco" type="number" step="0.01" placeholder="0,00"
                        :class="{ 'error-input': erros.preco }">
                    <span v-if="erros.preco" class="msg-erro">Preço inválido</span>
                </div>
                <div class="campo">
                    <label> Unidade</label>
                    <input v-model="produto.unidade" type="text" placeholder="Ex: UN, KG, PC">
                </div>
                <div class="campo">
                    <label>Formato <span class="obrigatorio">*</span></label>
                    <select v-model="produto.formato">
                        <option value=""> Selecione</option>
                        <option value="S"> Simples</option>
                    </select>
                    <span v-if="erros.formato" class="msg-erro">Formato obrigatório</span>
                </div>
                <div class="campo">
                    <label>Tipo <span class="obrigatorio">*</span></label>
                    <select v-model="produto.tipo">
                        <option value="">Selecione</option>
                        <option value="P">Produto</option>
                        <option value="S">Serviço</option>
                    </select>
                    <span v-if="erros.tipo" class="msg-erro">Tipo obrigatório</span>
                </div>
                <div class="campo">
                    <label>Situação <span class="obrigatorio">*</span></label>
                    <select v-model="produto.situacao">
                        <option value="">Selecione</option>
                        <option value="A">Ativo</option>
                        <option value="I">Inativo</option>
                    </select>
                    <span v-if="erros.situacao" class="msg-erro">Selecione uma situação válida!</span>
                </div>
                <div class="campo campo-descricao">
                    <label>Descrição curta</label>
                    <input v-model="produto.descricaoCurta" type="text">
                </div>
            </div>

            <div class="botoes-form">
                <button type="button" @click="$emit('cancelar')" class="btn-cancelar">
                    Cancelar
                </button>
                <button type="submit" class="btn-salvar">
                    <span class="material-icons">save</span>
                    {{ textoBotao }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const erros = ref<any>({});

const props = defineProps({
    produto: { type: Object, required: true },
    titulo: { type: String, required: true },
    textoBotao: { type: String, required: true },
});

const emit = defineEmits(['voltar', 'salvar', 'cancelar']);

const salvar = () => {
    erros.value = {};
    let valido = true;

    if (!props.produto.nome) {
        erros.value.nome = true;
        valido = false;
    }
    if (!props.produto.codigo) {
        erros.value.codigo = true;
        valido = false;
    }
    if (!props.produto.preco || props.produto.preco <= 0) {
        erros.value.preco = true;
        valido = false;
    }
    if (!props.produto.formato) {
        erros.value.formato = true;
        valido = false;
    }
    if (!props.produto.tipo) {
        erros.value.tipo = true;
        valido = false;
    }
    if (!props.produto.situacao) {
        erros.value.situacao = true;
        valido = false;
    }
    if (Object.keys(erros.value).length === 0 && valido) {
        emit('salvar');
    } else {
        alert('Por favor, preencha os campos obrigatórios corretamente.');
    }
};

</script>

<style scoped>
.cadastro-container {
    padding: 2rem 4rem;
    background-color: var(--cor-secundaria);
    min-height: 87vh;
}

.header-acao {
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

.campo input,
.campo select {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
}

.error-input {
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

.botoes-form {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
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