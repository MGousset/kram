<script setup lang="ts">
import { transformDirection } from 'three/tsl'
import { onMounted } from 'vue'

/** Define props */
export type Props = {
  id: string
}

const { id } = defineProps<Props>()
let div: HTMLDivElement
onMounted(() => {
  div = document.getElementById(id) as HTMLDivElement
})

function onMouseMove(e: MouseEvent): void {
  const rect = div.getBoundingClientRect()
  const transformRotation = `rotate3d(${(e.clientX - rect.x) / rect.width}, ${(e.clientY - rect.y) / rect.height}, 0, 30deg)`
  console.log(transformRotation)
  div.style.transform = transformRotation
}
</script>

<template>
  <div :id="id" @mousemove="onMouseMove">
    <slot></slot>
  </div>
</template>

<style lang="scss"></style>
