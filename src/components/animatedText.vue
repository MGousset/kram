<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

/** Define props */
type sceneProps = {
  label: string
  class?: string
  animation?: string
}

const props = defineProps<sceneProps>()

const initialTextArray = Array.from(props.label).map((t) => {
  return { label: t }
})
const textArray = ref([...initialTextArray])

const randomLetters = 'QWERTYUIOPASDFGHJKLZXCVBNM?/:!-+#'.split('')

async function animateLetter(char: string, step: number): Promise<string> {
  char = randomLetters[Math.floor(Math.random() * randomLetters.length)]!
  return char
}

async function animate(duration: number = 200, stepDuration: number = 15): Promise<void> {
  for (let i = 0; i < Math.floor(duration / stepDuration); i++) {
    const newTextArray = []
    for (const char of textArray.value) {
      newTextArray.push({ label: await animateLetter(char.label, i) })
    }
    textArray.value = newTextArray
    await new Promise((f) => setTimeout(f, stepDuration))
  }

  textArray.value = initialTextArray
}

onMounted(() => {
  animate(1500, 20)
})
</script>

<template>
  <div class="flex flex-row" @mouseenter="() => animate()">
    <p v-for="(text, i) in textArray" :key="i" :class="props.class">{{ text.label }}</p>
  </div>
</template>

<style lang="scss"></style>
