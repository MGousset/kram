<script setup lang="ts">
import { randomLetters } from '@/tools/tools'
import { onMounted, ref, watch } from 'vue'

const enum ANIMATION {
  random,
  randomstep,
}

/** Define props */
type sceneProps = {
  label: string
  containerClasses?: string
  textClasses?: string
}

const props = defineProps<sceneProps>()

/** Define variables  */
const initialTextArray = Array.from(props.label).map((t) => {
  return { label: t }
})
const textArray = ref([...initialTextArray])

/** Animation of one letter */
async function animateLetter(
  char: string,
  step: number,
  animation: ANIMATION = ANIMATION.random,
): Promise<string> {
  if ([ANIMATION.random, ANIMATION.randomstep].includes(animation)) {
    char = randomLetters[Math.floor(Math.random() * randomLetters.length)]!
  }

  return char
}

/** Animation of all text */
async function animate(
  duration: number = 200,
  stepDuration: number = 15,
  animation: ANIMATION = ANIMATION.random,
): Promise<void> {
  const stepNumber = Math.floor(duration / stepDuration)
  const letterNumer = textArray.value.length

  for (let i = 0; i <= stepNumber; i++) {
    const newTextArray = []
    for (const char of textArray.value) {
      newTextArray.push({ label: await animateLetter(char.label, i, animation) })
    }

    if (animation === ANIMATION.randomstep) {
      const reachedLetterIndex = Math.floor((i * letterNumer) / stepNumber)
      for (let li = 0; li <= reachedLetterIndex; li++) {
        newTextArray[li] = initialTextArray[li]!
      }
    }
    textArray.value = newTextArray
    await new Promise((f) => setTimeout(f, stepDuration))
  }

  textArray.value = initialTextArray
}

onMounted(() => {
  animate(2000, 15, ANIMATION.randomstep)
})
</script>

<template>
  <div class="flex flex-row .flex-start" :class="props.containerClasses">
    <p
      v-for="(text, i) in textArray"
      :key="i"
      class="letter flex flex-center flex-align-center"
      :class="props.textClasses"
    >
      {{ text.label }}
    </p>
  </div>
</template>

<style lang="scss">
.letter {
  width: 7.5vw; // Arbitrary looking good
}
</style>
