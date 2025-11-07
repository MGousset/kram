<script setup lang="ts">
import { computed } from 'vue'

/** Define props */
type sceneProps = {
  animated: boolean
  animation: string
}

const props = defineProps<sceneProps>()

// random duration between 1 and 2
const duration = Math.max(Math.min(Math.random() * 3, 1), 3)
const delay = Math.random() * duration

const durationString = duration + 's'
const state = computed(() => (props.animated ? 'running' : 'paused'))
</script>

<template>
  <slot></slot>
</template>

<style lang="scss">
a {
  transition: margin-left ease-in-out 1s 1s;
  transition: margin-right ease-in-out 1s 1s;
  animation: v-bind(durationString) ease-in-out infinite alternate v-bind(animation);
  animation-play-state: v-bind(state);
  animation-delay: v-bind(delay);
}
</style>
