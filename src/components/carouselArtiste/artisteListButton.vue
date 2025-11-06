<script setup lang="ts">

export type artisteListButtonProps = {
  name: string
  index: number
  classes?: string
}

const props = defineProps<artisteListButtonProps>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

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
