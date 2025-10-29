<script setup lang="ts">
import { ref } from 'vue'
import sceneItem from './components/sceneItem.vue'

const backgroundColor = ref('black')
const meshColor = ref('red')
</script>

<template>
  <sceneItem
    id="scene"
    class="w-100 h-100"
    :background-color="backgroundColor"
    :meshColor="meshColor"
  ></sceneItem>
</template>

<style lang="scss">
#scene {
}
</style>
