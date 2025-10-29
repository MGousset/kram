<script setup lang="ts">
import { ref } from 'vue'
import sceneItem from './components/sceneItem.vue'

const backgroundColor = ref('black')
</script>

<template>
  <sceneItem id="scene" :background-color="backgroundColor"></sceneItem>
  <div id="layout" class="h-100 w-100"></div>
</template>

<style lang="scss">
#scene,
#layout {
  position: fixed;
}
#layout {
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.2);
  background-image: url('../../assets/noise.svg');
}
</style>
