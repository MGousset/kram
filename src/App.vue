<script setup lang="ts">
import animatedBg from './components/animatedBg/animatedBg.vue'
import { computed, onMounted, ref } from 'vue'
import animatedLink from './components/leftRightAnimated.vue'
import animatedText from './components/animatedText.vue'
import artistItem from './components/artistItem.vue'
import { ANIMATION } from '@/tools/tools'
import { useWindowSize } from '@vueuse/core'

const TITLE_FONT_SIZE = 10
const LINK_FONT_SIZE = 3

const linkFontSize = LINK_FONT_SIZE + 'vw'
const navLeftMargin = TITLE_FONT_SIZE / 10 + 'vw'

const mousePos = ref({ x: -1, y: -1 })
const scrollY = ref(0)
const isBgAnimated = ref(false) // TODO put false for dev

const isHeaderAnimationRunning = ref(true)
const topPosition = ref(0)
const titleFontSize = ref(TITLE_FONT_SIZE)
const navHeaderContainersSize = ref(100)
const headerHeight = useWindowSize().height

onMounted(() => {
  document.addEventListener('scroll', updateScrollY)
  document.addEventListener('wheel', updateScrollY)
  window.addEventListener('resize', updateBottomPosition)

  scrollTo({ top: 0 })
})

//Define Functions
async function updateMousePosition(e: MouseEvent): Promise<void> {
  mousePos.value = {
    x: e.x,
    y: e.y,
  }
}

async function resetMousePosition(): Promise<void> {
  mousePos.value = {
    x: -1,
    y: -1,
  }
}

function updateScrollY(e: Event): void {
  scrollY.value = window.scrollY
  if (scrollY.value === 0) {
    isHeaderAnimationRunning.value = true
  }
  updateBottomPosition()
}

const minVisibleHeight = 150
const maxHeigh = window.innerHeight
const minTopPosition = minVisibleHeight - maxHeigh
function updateBottomPosition(): void {
  let newTopPosition = -scrollY.value * 4
  if (newTopPosition <= minTopPosition) {
    // Stop bg animation if top is reached
    isBgAnimated.value = false
    newTopPosition = minTopPosition
    // Restart header animation
    isHeaderAnimationRunning.value = true
  } else {
    // isBgAnimated.value = true // TODO comment for dev
    if (newTopPosition === 0) {
      isHeaderAnimationRunning.value = true // Restart header animation at start position
    } else {
      isHeaderAnimationRunning.value = false // stop header animations during transition
    }
  }
  topPosition.value = newTopPosition
  headerHeight.value =
    minVisibleHeight +
    ((maxHeigh - minVisibleHeight) * (minTopPosition - topPosition.value)) / minTopPosition

  updateTitleFontSize()
  updateNavHeaderContainersSize()
}

function updateTitleFontSize(): void {
  titleFontSize.value =
    LINK_FONT_SIZE +
    ((TITLE_FONT_SIZE - LINK_FONT_SIZE) * (minTopPosition - topPosition.value)) / minTopPosition
}

function updateNavHeaderContainersSize(): void {
  navHeaderContainersSize.value = 45 + (55 * (minTopPosition - topPosition.value)) / minTopPosition
}
</script>

<template>
  <header class="w-100 flex flex-center" :style="{ height: headerHeight + 'px' }">
    <animatedBg :animated="isBgAnimated"></animatedBg>
    <div id="layout" class="h-100 w-100 no-events"></div>
    <div id="navHeader" class="w-100 flex flex-row flex-wrap flex-between no-events">
      <div
        id="titleContainer"
        class="flex flex-center"
        :style="{ width: (navHeaderContainersSize ?? 100) + '%' }"
      >
        <animatedText
          :animated="isHeaderAnimationRunning"
          :containerSize="navHeaderContainersSize"
          label="KRAM AGENCY"
          :fontSize="titleFontSize"
          containerClasses="titleContainer"
          textClasses="title"
          :onMontedAnimation="ANIMATION.randomstep"
          :onHoverLetterAnimation="ANIMATION.grow"
        ></animatedText>
      </div>

      <nav
        id="navBarContainer"
        class="navbar flex"
        :style="{ width: (navHeaderContainersSize ?? 100) + '%' }"
      >
        <ul class="w-100 navbar-nav flex flex-row flex-between">
          <li class="nav-item">
            <animatedLink
              :animated="isHeaderAnimationRunning"
              classes="nav-link underlign"
              href="#Roster"
              label="Roster"
              animation="slide-in"
            ></animatedLink>
          </li>
          <li class="nav-item">
            <animatedLink
              :animated="isHeaderAnimationRunning"
              classes="nav-link underlign"
              href="#Events"
              label="Events"
              animation="slide-in"
            ></animatedLink>
          </li>
          <li class="nav-item">
            <animatedLink
              :animated="isHeaderAnimationRunning"
              classes="nav-link underlign"
              href="#Contact"
              label="Contact"
              animation="slide-in"
            ></animatedLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <main
    class="w-100 absolute"
    @mousemove="updateMousePosition"
    @mouseout="resetMousePosition"
    :style="{
      top: maxHeigh + topPosition + (2 * minVisibleHeight * topPosition) / minTopPosition + 'px',
    }"
  >
    <div id="container">
      <div id="content">
        <section id="roster">
          <artistItem name="artist" desc="desc" :imgUrls="[]"></artistItem>
        </section>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@import './assets/main.scss';

header {
  background-color: black;
  position: fixed;

  #layout {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.2);
    background-image: url('../assets/noise.svg');
  }

  #navHeader {
    position: absolute;
    transform: translateY(-50%);
    top: 50%;

    padding: 15px 50px 15px 50px;

    .title {
      white-space: pre;
      pointer-events: visible;
      margin: 0;
      padding: 0;
    }

    .navbar {
      margin-left: v-bind(navLeftMargin);
      background: none;

      a {
        font-size: v-bind(linkFontSize);
        color: $color;
        pointer-events: visible;
      }
    }
  }
}

main {
  height: 100vw;

  #container {
    overflow: auto;
    width: 100%;
    min-height: 1500px;
    #content {
    }
  }

  @media (min-width: 1250px) {
    #container {
      width: 70%;
      margin: auto;
    }
  }
}
</style>
