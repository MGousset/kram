<script setup lang="ts">
import { ANIMATION, randomLetters } from '@/tools/tools'
import { onMounted, ref, watch } from 'vue'

/** Define props */
type sceneProps = {
  label: string
  fontSize: string
  containerClasses?: string
  textClasses?: string
  onMontedAnimation?: ANIMATION
  onHoverTextAnimation?: ANIMATION
  onHoverLetterAnimation?: ANIMATION
}

const props = defineProps<sceneProps>()

/** Define variables  */
const initialTextArray = props.label.split('')
const textArray = ref([...initialTextArray])

/** Animation of one letter */
async function animateLetter(p: {
  animation?: ANIMATION
  char?: string
  step?: number
  element?: HTMLElement
}): Promise<string | void> {
  const { animation, step, element } = p
  if (!animation) {
    return
  }

  let char = p.char
  if ([ANIMATION.random, ANIMATION.randomstep].includes(animation) && char) {
    char = randomLetters[Math.floor(Math.random() * randomLetters.length)]!
    return char
  }
  if (element) {
    if (animation === ANIMATION.grow) {
      const currentSize = Number(props.fontSize.slice(0, -2))
      const unity = element.style.fontSize[-2] ?? 'vw'
      if (isNaN(currentSize)) {
        return
      }
      element.style.fontSize = 1.2 * currentSize + unity
      element.classList.add('hovered')
      element.addEventListener(
        'mouseleave',
        () => {
          element.style.fontSize = currentSize + unity
          element.classList.remove('hovered')
        },
        {
          once: true,
        },
      )
    }
  }
}

/** Animation of all text */
async function animate(options?: {
  duration?: number
  stepDuration?: number
  animation?: ANIMATION
}): Promise<void> {
  const { animation, duration = 200, stepDuration = 15 } = options ?? {}
  if (!animation) {
    return
  }

  /** Different action for different animation, TODO separate functions */
  if ([ANIMATION.random, ANIMATION.randomstep].includes(animation)) {
    const stepNumber = Math.floor(duration / stepDuration)
    const maxLetterIndex = textArray.value.length - 1

    for (let i = 0; i <= stepNumber; i++) {
      const newTextArray = []

      for (const char of textArray.value) {
        const newChar = await animateLetter({ animation, char, step: i })
        newTextArray.push(newChar ?? '')
      }

      /** If is step animation, get letter of initial textuntil reached letter index (computed relatively with step) */
      if (animation === ANIMATION.randomstep) {
        const reachedLetterIndex = Math.floor((i * maxLetterIndex) / stepNumber)
        for (let li = 0; li <= reachedLetterIndex; li++) {
          newTextArray[li] = initialTextArray[li] ?? ''
        }
      }

      textArray.value = newTextArray
      await new Promise((f) => setTimeout(f, stepDuration))
    }

    if (animation === ANIMATION.random) {
      textArray.value = initialTextArray
    }
  }
}

onMounted(() => {
  animate({ animation: ANIMATION.randomstep, duration: 2000, stepDuration: 15 })
})

function onMouseEnterLetter(e: MouseEvent, char: string): void {
  if (e.target && props.onHoverLetterAnimation) {
    animateLetter({
      animation: props.onHoverLetterAnimation,
      char,
      element: e.target as HTMLElement,
    })
  }
}
</script>

<template>
  <div class="flex flex-row .flex-start" :class="props.containerClasses" @mouseenter="animate()">
    <span
      v-for="(char, i) in textArray"
      :key="i"
      class="letter flex flex-center flex-align-center"
      :class="props.textClasses"
      @mouseenter="(e: MouseEvent) => onMouseEnterLetter(e, char)"
    >
      {{ char }}
    </span>
  </div>
</template>

<style lang="scss">
.letter {
  transition: font-size 0.3s ease-in-out; // reset size animation time
  width: 7.5vw; // Arbitrary looking good
  font-size: v-bind(fontSize);

  &.hovered {
    transition: font-size 0.07s ease-in-out; // set size animation time
  }
}
</style>
