<template>
  <header>
    <div class="container">
      <img src="../assets/images/Logo.png" alt="Logo Ficticio" class="logo">
      <div class="cabecalho-navigation">
        <nav>
          <ul>
            <li><a href="#" class="navigation">Início</a></li>
            <li><a href="#" class="navigation">Funcionalidades</a></li>
            <li><a href="#" class="navigation">Planos</a></li>
            <li><a href="#" class="navigation">Contato</a></li>
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
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.container {
  margin: 0;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #061E29;
  position: relative;
  font-family: "Josefin Sans", sans-serif;
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
  color: #F3F4F4;
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
  color: #F3F4F4;
  text-decoration: none;
}

nav ul li a:hover {
  text-decoration: underline;
  color: #5F9598;
}

.login {
  margin-right: 3rem;
  text-decoration: none;
  color: #F3F4F4;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  font-family: "Josefin Sans", sans-serif;
  font-weight: 700;
}

.login:hover {
  background-color: #5F9598;
}

.logo {
  margin: 0;
  margin-left: 6rem;
  padding: 0;
  width: 70px;
}
</style>
