<template>
    <Cabecalho />
    <router-view />
    <Rodape />
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
body {
  background-color: var(--cor-terciaria);
}
</style>
