<script setup lang="ts">
/** Define props */
type sceneProps = {
  name: string
  desc: string
  imgUrls: string[]
  backGroundVideoUrl?: string
}

const props = defineProps<sceneProps>()
</script>

<template>
  <div id="container"></div>
</template>

<style lang="scss">
#container {
  height: 500px;
}
</style>
