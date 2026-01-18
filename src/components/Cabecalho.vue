<template>
  <header>
    <div class="container">
      <img src="../assets/images/Logo.png" alt="Logo Ficticio" class="logo">
      <div class="cabecalho-navigation">
        <nav>
          <ul>
            <li v-for="item in menuItens" :key="item.id"><a :href="'#' + item.id" class="navigation" @click.prevent="() => scrollToSection(item.id)">{{item.nome}}</a></li>
          </ul>
        </nav>
        <nav class="navigation-actions">
          <a href="https://api.bling.com.br/Api/v3" class="login">Entrar</a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
export default {
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
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%
}

.container {
  margin: 0;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--cor-primaria);
  position: relative;
  font-family: var(--fonte-principal);
  font-weight: 500;
  font-size: 20px;
}

.cabecalho-navigation nav:first-child {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.cabecalho-navigation {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1.5rem 0;
  color: var(--cor-texto);
  gap: 1rem;
}

.navigation-actions {
  margin-left: auto;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 5rem;
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
  padding: 1.5rem;
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
</style>
