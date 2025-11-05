<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// 🔹 1. Définition des props
export type artisteListButtonProps = {
  name: string
  index: number
  classes?: string
}

const props = defineProps<artisteListButtonProps>()

// 🔹 2. Définition des événements émis
const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

// 🔹 3. Fonction appelée quand on clique
const onClick = () => {
  emit('select', props.index)
}
</script>

<template>
  <button
    @click="onClick"
    :class="classes"
  >
    {{props.name}}
  </button>
</template>

<style lang="scss">
</style>
