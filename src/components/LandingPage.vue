<template>
  <Hero />
  <Plans />
  <Formulario />
</template>


<script lang="ts">
import Hero from './Hero.vue';
import Plans from './Plans.vue';
import Formulario from './Formulario.vue';


export default{
  name: "LandingPage",
  components: {
    Hero, Plans, Formulario
  }
}
</script>

