<script setup lang="ts">
import { ref } from 'vue'
import * as THREE from 'three'
import sceneItem from './components/sceneItem.vue'

const { animated, bgColors } = defineProps<{
  animated: boolean
  bgColors: { color1: THREE.Color; color2: THREE.Color }
}>()

function detectMobile(): boolean {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ]

  return (
    toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem)
    }) ||
    (window.innerWidth <= 800 && window.innerHeight <= 600)
  )
}

const isMobile = detectMobile()
</script>

<template>
  <div id="backgroundContainer">
    <div v-if="isMobile" id="scenePic" class="w-100 h-100"></div>
    <sceneItem v-else id="scene" :bgColors="bgColors" :animated></sceneItem>
  </div>
</template>

<style lang="scss">
#backgroundContainer {
  background-color: chocolate;
  z-index: -11;
  overflow: hidden;

  #scenePic {
    background-image: url('./assets/img/fixedBg.png');
    background-color: bisque;
  }
}
</style>
