<script setup lang="ts">
import { computed } from 'vue'

/** Define props */
type sceneProps = {
  animated: boolean
  href?: string
  label?: string
  classes?: string
  animation?: string
}

const props = defineProps<sceneProps>()

// random duration between 1 and 2
const duration = Math.max(Math.min(Math.random() * 3, 1), 3)
const delay = Math.random() * duration

const durationString = duration + 's'
const state = computed(() => (props.animated ? 'running' : 'paused'))
</script>

<template>
  <a v-if="href" :class="props.classes" :href="props.href">{{ label }}</a>
  <p v-else :class="props.classes">{{ label }}</p>
</template>

<style lang="scss">
a {
  transition: left ease-in-out 1s 1s;
  animation: v-bind(durationString) ease-in-out infinite alternate v-bind(animation);
  animation-play-state: v-bind(state);
  animation-delay: v-bind(delay);
}
</style>
