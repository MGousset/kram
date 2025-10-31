<script setup lang="ts">
import { ref } from 'vue'
import sceneItem from './components/sceneItem.vue'

const backgroundColor = ref('black')
</script>

<template>
  <div class="h-100 w-100">
    <sceneItem id="scene" :background-color="backgroundColor"></sceneItem>
    <div id="layout no-events" class="h-100 w-100"></div>
  </div>
</template>

<style lang="scss">
#scene,
#layout {
  position: absolute;
}

#layout {
  background-color: rgba(255, 255, 255, 0.2);
  background-image: url('../../assets/noise.svg');
}
</style>
