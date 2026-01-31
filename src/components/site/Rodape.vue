<template>
    <footer>
        <h2><a href="https://github.com/LuisMarques-bling"> Todos direitos reservados Luis Marques<sup aria-hidden="true">®</sup> <span class="sr-only">Marca registrada</span>. Projeto Devpool 2026</a></h2>
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
    .sr-only {
        position: absolute !important;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
</style>