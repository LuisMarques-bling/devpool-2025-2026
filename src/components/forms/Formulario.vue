<template>
    <section id="contato" class="formulario-secao">
        <div class="form-container">
            <h2>Entre em contato conosco</h2>
            <form @submit.prevent="handleSubmit" novalidate>
                <Input label="Nome Completo" id="nome" v-model="formData.nome" required :erro="erros.nome"
                    placeholder="Nome Completo" />
                <Input label="E-mail" type="email" id="nome" v-model="formData.email" required :erro="erros.email"
                    placeholder="exemplo@exemplo.com" />
                <Input label="Telefone" type="tel" id="telefone" v-model="formData.telefone"
                    placeholder="(00) 00000-0000" />
                <Input label="Nome da Empresa" type="text" id="nomeEmpresa" v-model="formData.nomeEmpresa" required
                    :erro="erros.nomeEmpresa" placeholder="Sua Empresa" />
                <Input label="Tamanho da Empresa" type="select" id="tamanhoEmpresa" v-model="formData.tamanhoEmpresa"
                    required :erro="erros.tamanhoEmpresa">
                <option disabled value="">Selecione uma opção:</option>
                <option value="pequena">Micro e pequena empresa: Até 10 funcionários</option>
                <option value="media">Empresa em crescimento: De 11 a 50 funcionários</option>
                <option value="grande">Médias e grandes empresas: Mais de 50 funcionários</option>
                </Input>
                <Input label="Mensagem" type="textarea" id="mensagem" v-model="formData.mensagem" required rows="4"
                    :erro="erros.mensagem" placeholder="Como podemos lhe ajudar?" />
                <p v-if="erroGenerico" class="aviso-erro-geral">
                    Por favor, preencha todos os campos obrigatórios corretamente
                </p>
                <button type="submit" class="btn-enviar" :class="{ 'btn-falso-disabled': !isFormValid}" :disabled="enviando">{{ enviando ? 'Enviando...' : 'Enviar Mensagem'}}</button>
            </form>
        </div>
    </section>
</template>

<script lang="ts">
import { useFormStore } from '../../stores/formStore';
import { mapState, mapActions } from 'pinia';
import Input from '../site/Input.vue';

export default {
    name: 'Formulario',
    components: { Input },
    data() {
        return {
            erroGenerico: false,
            erros: {} as Record<string, string>
        }
    },
    computed: {
        ...mapState(useFormStore, ['formData', 'enviando']),
        isFormValid() {
            const data = this.formData;
            return (
                data.nome !== '' &&
                data.email.trim() !== '' &&
                data.email.includes('@') &&
                data.nomeEmpresa.trim() !== '' &&
                data.tamanhoEmpresa.trim() !== '' &&
                data.mensagem.trim() !== ''
            )
        }
    },
    watch: {
        'formData.nome'(val) {
            if (val.length >= 3) delete this.erros.nome;
            else this.erros.nome = 'Nome inválido';
        },
        'formData.email'(val) {
            if (val.includes('@')) delete this.erros.email;
        }
    },
    methods: {
        ...mapActions(useFormStore, ['enviarFormulario']),
        validarCampos() {
            this.erros = {};
            const data = this.formData;

            if (data.nome.length < 3) this.erros.nome = "Preencha um nome válido";
            if (!data.email.includes('@')) this.erros.email = "Insira um e-mail válido";
            if (!data.nomeEmpresa.trim()) this.erros.nomeEmpresa = "O nome da empresa é obrigatório";
            if (!data.tamanhoEmpresa) this.erros.tamanhoEmpresa = "Selecione o tamanho de sua empresa";
            if (!data.mensagem.trim()) this.erros.mensagem = "A mensagem não pode estar vazia";

            return Object.keys(this.erros).length === 0;
        },
        async handleSubmit() {
            if (this.validarCampos()) {
                this.erroGenerico = false;
                await this.enviarFormulario();
                alert('Mensagem enviada com sucesso. Por gentileza aguarde contato de nossa equipe.');
            } else {
                this.erroGenerico = true;
                this.$nextTick(() => {
                    const primeiroErro = document.querySelector('.erro-mensagem');
                    if (primeiroErro) {
                        primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                });
            }
        }
    }
}
</script>

<style scoped>
.formulario-secao {
    padding: 4rem 2rem;
    font-family: var(--fonte-principal);
}

.form-container {
    max-width: 600px;
    margin: 0 auto;
    background: var(--cor-terciaria);
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 1);
}

h2 {
    color: var(--cor-texto);
    text-align: center;
    margin-bottom: 2rem;
}

.btn-enviar {
    width: 100%;
    padding: 1rem;
    background-color: var(--cor-primaria);
    color: var(--cor-texto);
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.3s;
    transition: all 0.3s ease;
}

.btn-enviar:hover {
    background-color: var(--cor-primaria);
}

input:invalid:focus,
select:invalid:focus,
textarea:invalid:focus {
    border-color: #e74c3c;
}

.aviso-erro-geral {
    color: #e74c3c;
    background-color: rgba(231, 76, 60, 0.1);
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin-bottom: 1rem;
    font-weight: bold;
}
.btn-falso-disabled{
    opacity: 0.6;
    cursor: not-allowed;
}
</style>