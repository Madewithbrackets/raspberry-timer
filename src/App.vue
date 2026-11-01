<script setup>
import { ref } from 'vue'
import BMO from './components/BMO.vue'
import Forza from './components/Forza.vue'

const components = [BMO, Forza]
const currentIndex = ref(1)

</script>

<template>
  <main class="w-full h-full">
    <div class="w-4 h-4 absolute z-50 right-0 top-0 bg-white opacity-70 hover:opacity-70" @click="currentIndex = currentIndex === 0 ? 1 : 0"></div>
    <component :is="components[currentIndex]" class="w-full h-full" />
  </main>
</template>
