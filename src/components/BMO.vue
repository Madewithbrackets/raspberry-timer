<script setup>
import { computed, ref } from 'vue'

import StatusIcon from './StatusIcon.vue'
import TemperatureIcon from './TemperatureIcon.vue'
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
const temperature = ref(16)

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
  } else if (position.value === 'readyForBreak') {
    position.value = 'break';
    time.value = breakLimit;
  } else if (position.value === 'break') {
    position.value = 'readyForWork';
    time.value = workLimit;
  }
}

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
    class="timer-container"
    @pointerdown="handlePointerDown"
    @pointerup="handlePointerUp"
    @pointercancel="handlePointerCancel"
    @pointerleave="handlePointerCancel"
    @click="handleClick"
  >
    <div class="screen radio relative">

      <img class="absolute z-0 w-full h-3/4 top-1/2 left-1/2 -translate-1/2  object-contain" src="../assets/bmo-happy.png" alt="BMO Happy" draggable="false" />
      
      <div class="status-bar relative z-10 grid grid-cols-[1fr_2fr_1fr] justify-between items-center">
        <StatusIcon :class="isRunning == true ? '' : 'blinking'" :position="position"/>

        <div :class="isRunning == true ? '' : 'blinking'" class="radio relative z-10">{{ displayTime }}</div>
        
        <div class="flex items-center justify-end">
          <div class="weather-icon"><TemperatureIcon :temperature="temperature"/></div>
          <div class="text-5xl">{{ temperature }}°</div>
        </div>
      </div>

      <div class="flex justify-center items-center z-10 absolute bottom-4 left-1/2 -translate-x-1/2">
        <div v-for="n in goal" :key="n">
          <img :class="n > completed ? 'opacity-40' : ''" src="../assets/life.png" />
        </div>
      </div>

    </div>
  </div>
</template>