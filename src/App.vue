<template>
  <body>
    <Cabecalho />
    <LandingPage />
  </body>
</template>

<script lang="ts">
import Cabecalho from './components/Cabecalho.vue';
import LandingPage from './components/LandingPage.vue';
export default {
  name: 'App',
  components: {
    Cabecalho, LandingPage
  },
};
</script>

<style>
body {
  background-color: #1D546D;
}
</style>
