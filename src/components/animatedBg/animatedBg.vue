<script setup lang="ts">
import { ref } from 'vue'
import * as THREE from 'three'
import sceneItem from './components/sceneItem.vue'

const { animated, bgColors } = defineProps<{
  animated: boolean
  bgColors: { color1: THREE.Color; color2: THREE.Color }
}>()
</script>

<template>
  <div id="backgroundContainer">
    <sceneItem id="scene" :bgColors="bgColors" :animated></sceneItem>
  </div>
</template>

<style lang="scss">
#backgroundContainer {
  background-color: chocolate;
  z-index: -11;
  overflow: hidden;
}
</style>
