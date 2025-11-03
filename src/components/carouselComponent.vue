<script setup lang="ts">
import type { types } from 'sass'
import { onMounted, ref } from 'vue'

/** Define props */
type sceneProps = {
  items: unknown[]
}

const { items } = defineProps<sceneProps>()

let previousItems
const reactiveItems = ref(items)
if (items.length > 1) {
  previousItems = items[-1]!
}

onMounted(() => {
  const container = document.getElementById('carouselContainer')
})
</script>

<template>
  <div id="carouselContainer" class="flex flex-between">
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import './../assets/main.scss';

#carouselContainer {
  width: 100vw;
  overflow-x: auto;

  .carouselItem {
    min-width: 100%;
    max-width: 100%;
    margin-left: 10%;
    margin-right: 10%;
    background-color: orange;
  }
}
</style>
