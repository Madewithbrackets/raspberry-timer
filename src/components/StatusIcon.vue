<script setup>
  import { computed } from 'vue'
  import pbImage from '../assets/pb.png'
  import jakeImage from '../assets/jake.png'

  const props = defineProps({
    position: String
  });

  const src = computed(() =>
    props.position === 'break' || props.position === 'readyForBreak'
      ? jakeImage
      : pbImage
  )
</script>

<template>
  <img class="object-contain object-top" width="60" height="60" :src="src" />
</template>