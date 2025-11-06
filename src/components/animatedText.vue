<script setup lang="ts">
import { ANIMATION, growElementText, randomLetters } from '@/tools/tools'
import { onMounted, ref } from 'vue'

const MULTIPLIER = 1.2
const GROW_DURATION = 0.1 // set size animation time, seems good like this
const REDUCE_DURATION = 0.3 // reset size animation time, seems good like this

const growDuration = GROW_DURATION + 's'
const reduceDuration = REDUCE_DURATION + 's'

/** Define props */
type sceneProps = {
  animated: boolean
  label: string
  fontSize: number
  containerClasses?: string
  textClasses?: string
  textStyles?: string
  onMontedAnimation?: ANIMATION
  onHoverTextAnimation?: ANIMATION
  onHoverLetterAnimation?: ANIMATION
  improtIndex?: Set<number>
}

const props = defineProps<sceneProps>()

/** Define variables  */
const initialTextArray = props.label.split('')
const textArray = ref([...initialTextArray])
let container: HTMLElement | null
const spanWidth = ref('0px')

onMounted(() => {
  container = document.getElementById('textContainer')
  window.addEventListener('resize', onResize)
  onResize()

  animate({ animation: ANIMATION.randomstep, duration: 2000, stepDuration: 15 })
})

function onResize(): void {
  let containerWidth = container?.clientWidth ?? 0
  containerWidth = containerWidth > 0 ? containerWidth : window.innerWidth
  spanWidth.value = containerWidth / initialTextArray.length + 'px'
}

/** Animation of all text */
async function animate(options?: {
  duration?: number
  stepDuration?: number
  animation?: ANIMATION
}): Promise<void> {
  const { animation, duration = 200, stepDuration = 15 } = options ?? {}
  if (!animation || !props.animated) {
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

/** Animation of one letter */
async function animateLetter(p: {
  animation?: ANIMATION
  char?: string
  step?: number
  element?: HTMLElement
}): Promise<string | void> {
  const { animation, step, element } = p
  if (!animation || !props.animated) {
    return
  }

  let char = p.char
  if ([ANIMATION.random, ANIMATION.randomstep].includes(animation) && char) {
    char = randomLetters[Math.floor(Math.random() * randomLetters.length)]!
    return char
  }
  if (element) {
    if (animation === ANIMATION.grow && !element.classList.contains('inTransition')) {
      element.classList.add('inTransition')
      const currentFont = growElementText(element, MULTIPLIER)

      await new Promise((f) => setTimeout(f, GROW_DURATION * 1000))
      element.classList.remove('inTransition')

      if (!currentFont) {
        return
      }
      element.classList.add('outTransition')
      element.style.fontSize = currentFont
      await new Promise((f) => setTimeout(f, REDUCE_DURATION * 1000))
      element.classList.remove('outTransition')
    }
  }
}

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
  <div
    id="textContainer"
    class="w-100 flex flex-row flex-"
    :class="props.containerClasses"
    @mouseenter="animate()"
  >
    <span
      v-for="(char, i) in textArray"
      :key="i"
      class="letter flex flex-center flex-align-center"
      :class="props.textClasses"
      @mouseenter="(e: MouseEvent) => onMouseEnterLetter(e, char)"
      :style="{ fontSize: (improtIndex?.has(i) ? fontSize * MULTIPLIER : fontSize) + 'vw' }"
    >
      {{ char }}
    </span>
  </div>
</template>

<style lang="scss">
.letter {
  width: v-bind(spanWidth);
  line-height: 10vw;
  height: 10vw;

  &.outTransition {
    transition: font-size v-bind(reduceDuration) ease-in-out;
  }

  &.inTransition {
    transition: font-size v-bind(growDuration) ease-in-out;
  }
}
</style>
