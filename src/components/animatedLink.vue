<script setup lang="ts">
/** Define props */
type sceneProps = {
  href: string
  label?: string
  classes?: string
  animation?: string
}

const props = defineProps<sceneProps>()

// random duration between 1 and 2
const duration = Math.max(Math.min(Math.random() * 3, 1), 3)
const delay = Math.random() * duration

const durationString = duration + 's'
</script>

<template>
  <a :class="props.classes" :href="props.href">{{ label }}</a>
</template>

<style lang="scss">
a {
  animation: v-bind(durationString) ease-in-out infinite alternate v-bind(animation) running;
  animation-delay: v-bind(delay);
}
</style>
