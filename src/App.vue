<template>
    <Cabecalho />
    <router-view />
    <Rodape class="rodape" />
</template>

<script lang="ts">
import Cabecalho from './components/Cabecalho.vue';
import Rodape from './components/Rodape.vue';


export default {
  name: 'App',
  components: {
    Cabecalho, Rodape
  },
};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: var(--cor-terciaria);
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

</style>
