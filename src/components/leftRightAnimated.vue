<script setup lang="ts">
/** Define props */
type sceneProps = {
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
</script>

<template>
  <a v-if="href" :class="props.classes" :href="props.href">{{ label }}</a>
  <p v-else :class="props.classes">{{ label }}</p>
</template>

<style lang="scss">
a {
  animation: v-bind(durationString) ease-in-out infinite alternate v-bind(animation) running;
  animation-delay: v-bind(delay);
}
</style>
