<template>
  <div class="callback-container">
    <h1>Autenticando...</h1>
    <p>Por favor, aguarde enquanto processamos sua conexão com o Bling.</p>
  </div>
</template>


<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {

  const code = route.query.code as string;
  const state = route.query.state as string;

  if (code && state) {
    try {
      await authStore.exchangeCodeForToken(code, state);
      router.push('./Produtos');
    } catch (error) {
      router.push('/')
    }
  }
});
</script>