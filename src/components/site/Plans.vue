<template>
    <section class="plans" id ="planos">
        <div id ="funcionalidades" v-for="plan in plans" :key="plan.name"
             :class="['plans__' + plan.type, { 'plans__highlight': plan.destaque && highlight, 'plans__card': true }]" >
            <a href="#contato" class="plans__link">
                <h3 :class="'plans__' + plan.type + '-titulo'">{{ plan.name }}</h3>
                <p :class="'plans__' + plan.type + '-texto'">{{ plan.currency }} {{ plan.price.toFixed(2) }}</p>
                <p :class="'plans__' + plan.type + '-texto'">{{ plan.periodicity }}</p>
                <p :class="'plans__' + plan.type + '-texto'"v-html = "plan.features.join('<br>')"></p>
                <span class="contratar" role="button">Contratar</span>
            </a>
            <div class="plans__details" aria-hidden="true">
                <p class="plans__desc">{{ plan.periodicity }}</p>
                <ul class="plans__features">
                    <li v-for="(f, i) in plan.features" :key="i">{{ f }}</li>
                </ul>
            </div>
        </div>
    </section>
</template>



<script lang="ts">
import plansData from '../../mocks/plans.json'

export default {
    name: 'Plans',
    props: {
        highlight: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            plans: plansData.plans
        }
    }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.plans {
    display: flex;
    align-items: center;
    padding: 2em;
    margin: 0 5rem;
    justify-content: space-around;
    font-family: var(--fonte-principal);
}

.plans__basic, .plans__essential, .plans__premium  {
    border: 2px solid var(--cor-primaria);
    text-align: center;
    border-radius: 15px;
    color: var(--cor-texto);
    position: relative;
    width: 260px;
    padding: 1.5rem;
    box-sizing: border-box;
    background-clip: padding-box;
}

.plans__basic-titulo, .plans__essential-titulo, .plans__premium-titulo {
    padding: 0.5rem 0;
    font-size: 24px;
}

.plans__basic-texto, .plans__essential-texto, .plans__premium-texto {
    padding-bottom: 2rem;
    font-size: 20px;
}
.plans__highlight {
    box-shadow: 0 8px 24px rgba(6, 30, 41, 0.7);
    transform: translateY(-10px);
    transition: transform .2s, box-shadow .2s;
    background-color: var(--cor-primaria);
    z-index: 2;
}
a {
    text-decoration: none;
    color: var(--cor-texto);
}

.plans__link {
    display: block;
    z-index: 1;
    position: relative;
}

.plans__details {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) translateY(8px) scale(0.98);
    width: 100%;
    max-width: 320px;
    padding: 1rem;
    background: rgba(11, 42, 54, 0.95);
    color: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 30px rgba(6,30,41,0.35);
    opacity: 0;
    pointer-events: none;
    transition: opacity .18s ease, transform .18s ease;
    text-align: left;
    z-index: 5;
}

.plans__card:hover .plans__details,
.plans__card:focus-within .plans__details {
    opacity: 1;
    transform: translate(-50%, -50%) translateY(0) scale(1);
    pointer-events: auto;
}
.plans__desc {
    margin: 0 0 0.5rem 0;
    font-size: 20px;
    opacity: 0.95;
}

.plans__features {
    margin: 0;
    padding-left: 1rem;
    font-size: 18px;
    list-style:circle;
    color: var(--cor-texto);
}
.contratar{
    font-size: 20px;
    padding: 0.3em;
    background-color: var(--cor-secundaria);
    border-radius: 5px;
}
.contratar:hover{
    background-color: var(--cor-terciaria);
}
</style>