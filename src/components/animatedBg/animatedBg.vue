<script setup lang="ts">
import * as THREE from 'three'
import sceneItem from './components/sceneItem.vue'
import { detectMobile } from '@/tools/tools'

const { animated, bgColors } = defineProps<{
  animated: boolean
  bgColors: { color1: THREE.Color; color2: THREE.Color }
}>()

const isMobile = detectMobile()
</script>

<template>
  <div id="backgroundContainer">
    <div v-if="isMobile" id="scenePic" class="w-100 h-100"></div>
    <sceneItem v-else id="scene" :bgColors="bgColors" :animated="animated && !isMobile"></sceneItem>
  </div>
</template>

<style lang="scss">
#backgroundContainer {
  background-color: chocolate;
  z-index: -11;
  overflow: hidden;

  #scenePic {
    background-image: url('@/assets/img/fixedBg.jpg');
    background-color: #181818;
  }
}
</style>
