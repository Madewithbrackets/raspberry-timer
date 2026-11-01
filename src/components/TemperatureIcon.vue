<script setup>
  import finnImage from '../assets/finn.png'
  import marcyImage from '../assets/marcy.png'
  import lumpyImage from '../assets/lumpy.png'

  const props = defineProps({
    temperature: Number
  });

  let src = marcyImage;

    if (props.temperature > 8 && props.temperature <= 15) {
    src = lumpyImage
  } else if (props.temperature > 15) {
    src = finnImage
  }
</script>

<template>
    <img class="object-contain" width="60" height="60" :src="src" />
</template>