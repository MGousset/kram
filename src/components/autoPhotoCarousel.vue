<script setup lang="ts">
import { onMounted } from 'vue'

/** Define props */
type sceneProps = {
  imgUrls: string[]
  containerClasses?: string
  imgClasses?: string
}

const { imgUrls } = defineProps<sceneProps>()

onMounted(() => {})
</script>

<template>
  <div id="carouselContainer" class="w-100 flex flex-between" :class="containerClasses">
    <img
      v-for="imgUrl in imgUrls"
      :key="imgUrl"
      :src="imgUrl"
      class="carouselImg"
      :class="imgClasses"
    />
  </div>
</template>

<style lang="scss">
@import './../assets/main.scss';

#carouselContainer {
  overflow-x: auto;

  .carouselImg {
    min-width: 100%;
    min-height: 100%;
  }
}
</style>
