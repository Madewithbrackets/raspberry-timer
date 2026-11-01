<script setup>
import { computed, ref } from 'vue'

import { useClickHandler } from '../clickHandler.js'

// settings
const workLimit = 45 * 60 // 45 minutes in seconds
const breakLimit = 10 * 60 // 10 minutes in seconds
const goal = ref(5)

// tracking
const running = ref(false)
const time = ref(workLimit)
const completed = ref(0)

// fetched
const url = "https://data.api.xweather.com/conditions/london%2C%20uk?client_id=CniyPiiP5wdPJlScJZgiX&client_secret=xhemzwUPWfzFCk36CHjlBrr0G9g9XP3UhRhVsWIc";

const temperature = ref(0)

const videoIds = [
  'A51PuPOSXhw',
  'oWBcs3hYd7o',
  'XZRZO_RstLg',
  'qnTwpdjmOXs',
  'VSl7KZa8reA',
  'j7bPVCz2LrM',
  'pq4OBOx_XXM',
  'EAkHu3ESPVE',
  'ZUdhPnr38ZY',
  'oFPKgYu7o3Y',
  'VyPq4A3vc5U',
  'naomXtR-kzw',
  'Pzzm3af_53E',
]
const videoId = videoIds[Math.floor(Math.random() * videoIds.length)]
const videoUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&mute=0&controls=1&playsinline=1&loop=1&playlist=${videoId}&rel=0&vq=hd720`

const decrementTime = () => {
  if (!running.value) return;

  if (time.value > 0) {
    time.value--;
  }
  if (time.value === 0) {
    running.value = false;
    if (position.value === 'work') {
      gainLife();
    }
    nextPosition();
  }
}

const displayTime = computed(() => {
  const minutes = Math.floor(time.value / 60);
  const seconds = time.value % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
});

setInterval(decrementTime, 1000);

// readyforwork, work, readyforbreak, break, paused
const position = ref('readyForWork');

const nextPosition = () => {
  if (position.value === 'readyForWork') {
    position.value = 'work';
    time.value = workLimit;
  } else if (position.value === 'work') {
    position.value = 'readyForBreak';
    time.value = breakLimit;
    updateTemperature();
  } else if (position.value === 'readyForBreak') {
    position.value = 'break';
    time.value = breakLimit;
  } else if (position.value === 'break') {
    position.value = 'readyForWork';
    time.value = workLimit;
  }
}

const updateTemperature = async () => {
  const response = await fetch(url);
  const data = await response.json();
  temperature.value = data?.response?.[0]?.periods?.[0]?.tempC + 'c | ' + data?.response?.[0]?.periods?.[0]?.weather ?? 16;
}

updateTemperature().catch(console.error);

const pauseTimer = () => {
  running.value = false;
}

const startTimer = () => {
  if (position.value === 'readyForWork') {
    position.value = 'work';
    time.value = workLimit;
  } else if (position.value === 'readyForBreak') {
    position.value = 'break';
    time.value = breakLimit;
  }
  running.value = true;
}

const singleClick = () => {
  if (running.value) {
    pauseTimer();
  } else {
    startTimer();
  }
}

const doubleClick = () => {
  resetTimer();
}

const longPress = () => {
  skipTimer();
}

const {
  handlePointerDown,
  handlePointerUp,
  handlePointerCancel,
  handleClick,
} = useClickHandler({ singleClick, doubleClick, longPress });

const gainLife = () => {
  if (completed.value < goal.value) {
    completed.value++;
  }
}

const resetTimer = () => {
  pauseTimer();
  time.value = position.value === 'break' || position.value === 'readyForBreak'
    ? breakLimit
    : workLimit;  
}

const skipTimer = () => {
  const skippedPosition = position.value;
  pauseTimer();
  nextPosition();
  if (skippedPosition === 'work') {
    gainLife();
  }
}

const isRunning = computed(() => running.value);

</script>

<template>
  <div
    class="h-screen w-screen"
  >
    <div class="w-full h-full relative overflow-hidden">

      <iframe
        class="absolute inset-0 h-full w-full border-0"
        :src="videoUrl"
        title="Random Forza Horizon video from thsunami"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
      
      <div class=" relative z-10 flex gap-12 pl-24 mt-12 items-center w-full"
        @pointerdown="handlePointerDown"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerCancel"
        @pointerleave="handlePointerCancel"
        @click="handleClick"
      >
        <div :class="isRunning == true ? '' : 'blinking'" class="radio text-white text-[60px] relative z-10">{{ displayTime }}</div>

        <div class="flex gap-2 justify-center items-center">
          <div v-for="n in goal" :key="n">
            <div class="w-4 h-4 rounded-sm border-2 border-white " :class="n > completed ? '' : 'bg-white'"></div>
          </div>
        </div>

        <div class="text-white text-2xl radio">{{ temperature }}</div>

      </div>

    </div>
  </div>
</template>