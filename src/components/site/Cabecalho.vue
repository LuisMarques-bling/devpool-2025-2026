<template>
  <header>
    <div class="container cabecalho-grid">
      <div class="header-left">
        <img src="../../assets/images/Logo.png" alt="Logo Ficticio" class="logo">
      </div>
        <div class="header-center">
          <nav v-if="!authStore.isAuthenticated">
            <ul>
              <li v-for="item in menuItens" :key="item.id"><a :href="'#' + item.id" class="navigation"
                  @click.prevent="() => scrollToSection(item.id)">{{ item.nome }}</a></li>
            </ul>
          </nav>
        </div>
        <div class="header-right">
          <nav class="navigation-actions">
            <a v-if="!authStore.isAuthenticated" href="#" @click.prevent="iniciarLogin" class="login">Entrar</a>
            <a v-else href="#" @click.prevent="executarLogout" class="login logout-style btn-minha-conta">
              <span class="material-icons">logout</span>
              <div class="texto-container">
                <span class="label-conta">Minha conta</span>
                <span class="label-sair">Sair</span>
              </div>
            </a>
          </nav>
        </div>
    </div>
  </header>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const iniciarLogin = () => {
      const state = authStore.generateState();
      const baseUrl = "https://www.bling.com.br/b/Api/v3/oauth/authorize"
      const loginUrl = `${baseUrl}?response_type=code&client_id=${authStore.clientId}&state=${state}`
      window.location.href = loginUrl;
    };
    const executarLogout = () => {
      authStore.logout();
      router.push('/');
    };
    return { authStore, iniciarLogin, executarLogout }

  },
  name: 'cabecalho',
  data() {
    return {
      menuItens: [
        { nome: 'Inicio', id: 'inicio' },
        { nome: 'Funcionalidades', id: 'funcionalidades' },
        { nome: 'Planos', id: 'planos' },
        { nome: 'Contato', id: 'contato' },
      ]
    };
  },
  methods: {
    scrollToSection(id: string) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.cabecalho-grid{
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0.5rem 2rem;
  box-sizing: border-box;
}

.header-left{
  display: flex;
  justify-content: flex-start;
}

.header-center{
  display: flex;
  justify-content: center;
}

.header-right{
  display: flex;
  justify-content: flex-end;
}

header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%
}

.container {
  margin: 0 auto;
  width: 100%;
  max-width: 100vw;
  background-color: var(--cor-primaria);
  font-family: var(--fonte-principal);
  font-weight: 500;
  font-size: 20px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

nav ul li a {
  color: var(--cor-texto);
  text-decoration: none;
}

nav ul li a:hover {
  text-decoration: underline;
  color: var(--cor-secundaria);
}

.login {
  margin-right: 3rem;
  text-decoration: none;
  color: var(--cor-texto);
  padding: 1.2rem;
  border-radius: 10px;
  text-align: center;
  font-family: var(--fonte-principal);
  font-weight: 700;
}

.login:hover {
  background-color: var(--cor-secundaria);
}

.logo {
  margin: 0;
  margin-left: 6rem;
  padding: 0;
  width: 60px;
}

.logout-style {
  background-color: var(--cor-secundaria);
  color: var(--cor-primaria);
}

.btn-minha-conta {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s ease;
}

.texto-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.material-icons-outlined {
  font-size: 24px;
  color: var(--cor-primaria);
}

.label-conta {
  font-size: 16px;
  font-weight: 700;
}

.label-sair {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-minha-conta:hover {
  transform: translateX(3px);
  background-color: var(--cor-texto);
}

</style>
