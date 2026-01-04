<template>
  <Hero />
  <Plans />
</template>


<script lang="ts">
import Hero from './Hero.vue';
import Plans from './Plans.vue';


export default{
  name: "LandingPage",
  components: {
    Hero, Plans
  }
}
</script>

