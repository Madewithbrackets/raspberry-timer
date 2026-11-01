<script setup>
import { ref } from 'vue'
import BMO from './components/BMO.vue'
import Forza from './components/Forza.vue'

const components = [BMO, Forza]
const currentIndex = ref(1)
let touchStartX = 0
let touchStartY = 0

const handleTouchStart = (event) => {
  touchStartX = event.changedTouches[0].clientX
  touchStartY = event.changedTouches[0].clientY
}

const handleTouchEnd = (event) => {
  const deltaX = event.changedTouches[0].clientX - touchStartX
  const deltaY = event.changedTouches[0].clientY - touchStartY

  if (Math.abs(deltaX) < 60 || Math.abs(deltaX) <= Math.abs(deltaY)) return

  currentIndex.value = currentIndex.value === 0 ? 1 : 0
}
</script>

<template>
  <main class="w-full h-full touch-pan-y" @touchstart.passive="handleTouchStart" @touchend="handleTouchEnd">
    <component :is="components[currentIndex]" class="w-full h-full" />
  </main>
</template>
