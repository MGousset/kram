<script setup lang="ts">
/** Define props */
export type artistesProps = {
  name: string
  description: string
  imgUrls: string[]
  backGroundVideoUrl?: string
}

const props = defineProps<artistesProps>()
</script>

<template>
  <div id="artiteContainer" class="h-100 w-100">
    <h2>
      {{ name }}
    </h2>
    <p>{{ description }}</p>
  </div>
</template>

<style lang="scss">
#artiteContainer {
}
</style>
