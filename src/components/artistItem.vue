<script setup lang="ts">
/** Define props */
export type artistesProps = {
  name: string
  description: string
  imgUrls: string[]
  backGroundVideoUrl?: string
  classes?: string
}

const props = defineProps<artistesProps>()
</script>

<template>
  <div id="artistContainer" :class="classes">
    <h2>
      {{ name }}
    </h2>
    <p>{{ description }}</p>
  </div>
</template>

<style lang="scss">
#artistContainer {
  background-color: black;
  h2,
  p {
    color: white;
  }
}
</style>
