<template>
    <section class="hero" id = "inicio">
        <div class="container">
            <div class="container__texto">
                <h2 class="container__titulo"> A melhor escolha para sua gestão empresarial</h2>
                <p class="container__paragrafo">Assuma o controle total do seu negócio com uma plataforma que integra
                    todos os seus processos em uma interface intuitiva, substituindo o caos das planilhas por decisões
                    estratégicas baseadas em dados reais.</p>
                <a href="#contato" class="container__button"><button>Experimente Grátis</button></a>
            </div>
            <img src="../../assets/images/ImagemFicticia1.png" alt="PessoaFicticiatrabalhando" class="container__img"
                width="20%">
        </div>
    </section>
</template>

<script lang="ts">

export default {
    name: 'Hero'
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.hero {
    padding: 1.5rem 0;
}

.container {
    display: flex;
    align-items: center;
    gap: 10rem;
    margin: 0 2rem;
    padding: 1.5rem 5rem;
    background-color: var(--cor-primaria);
    border-radius: 10px;
    color: var(--cor-texto);
}

.container__texto {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: var(--fonte-principal);
    align-items: center;
}

.container__titulo {
    font-size: 28px;
    font-weight: 500;
    margin: 0;
}

.container__paragrafo {
    font-size: 20px;
    text-align: center;
}

.container__button button {
    background-color: var(--cor-terciaria);
    color: var(--cor-texto);
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    font-family: var(--fonte-principal);
}

.container__button button:hover {
    background-color: var(--cor-secundaria);
}

.container__img {
    width: 300px;
    height: auto;
    object-fit: contain;
    flex-shrink: 0;
}
</style>