<template>
  <body>
    <Cabecalho />
    <LandingPage />
    <Rodape />
  </body>
</template>

<script lang="ts">
import Cabecalho from './components/Cabecalho.vue';
import LandingPage from './components/LandingPage.vue';
import Rodape from './components/Rodape.vue';
export default {
  name: 'App',
  components: {
    Cabecalho, LandingPage, Rodape
  },
};
</script>

<style>
body {
  background-color: var(--cor-terciaria);
}
</style>
