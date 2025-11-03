<script setup lang="ts">
import { onMounted } from 'vue'

/** Define props */
type sceneProps = {
  imgUrls: string[]
}

const { imgUrls } = defineProps<sceneProps>()

onMounted(() => {})
</script>

<template>
  <div id="carouselContainer" class="h-100 w-100 flex flex-between">
    <img v-for="imgUrl in imgUrls" :key="imgUrl" :src="imgUrl" class="h-100 w-100 carouselImg" />
  </div>
</template>

<style lang="scss">
@import './../assets/main.scss';

#carouselContainer {
  width: 100vw;
  overflow-x: auto;

  .carouselImg {
    min-width: 100%;
    min-height: 100%;
  }
}
</style>
