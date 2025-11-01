<script setup lang="ts">
import { ref } from 'vue'
import sceneItem from './components/sceneItem.vue'

const backgroundColor = ref('black')

const { animated } = defineProps<{ animated: boolean }>()
</script>

<template>
  <div id="backgroundContainer">
    <sceneItem id="scene" :background-color="backgroundColor" :animated></sceneItem>
  </div>
</template>

<style lang="scss">
#backgroundContainer {
  overflow: hidden;
}
</style>
