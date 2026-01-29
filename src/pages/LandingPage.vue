<template>
  <Hero />
  <Plans />
  <Formulario />
</template>


<script lang="ts">
import Hero from '../components/site/Hero.vue';
import Plans from '../components/site/Plans.vue';
import Formulario from '../components/forms/Formulario.vue';


export default{
  name: "LandingPage",
  components: {
    Hero, Plans, Formulario
  }
}
</script>

