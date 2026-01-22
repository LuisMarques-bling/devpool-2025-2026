<template>
    <footer>
        <h2><a href="https://github.com/LuisMarques-bling"> Todos direitos reservados Luis Marques. Projeto Devpool 2026</a></h2>
    </footer>
</template>

<script lang="ts">
    export default {
        name: 'Rodape'
    }
</script>

<style scoped>
    footer{
        text-align: center;
        font-family: var(--fonte-principal);
        font-size: 12px;
    }

    h2{
        background-color: var(--cor-primaria);
        padding: 1em;
    }
    a{
        text-decoration: none;
        color: var(--cor-texto);
    }
</style>