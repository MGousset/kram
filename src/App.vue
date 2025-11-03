<script setup lang="ts">
import animatedBg from './components/animatedBg/animatedBg.vue'
import { createApp, onMounted, ref } from 'vue'
import animatedLink from './components/leftRightAnimated.vue'
import animatedText from './components/animatedText.vue'
import carouselComponent from './components/carouselComponent.vue'
import { ANIMATION } from '@/tools/tools'
import { useWindowSize } from '@vueuse/core'
import ArtistItem from './components/artistItem.vue'
import type { artistesProps } from './components/artistItem.vue'

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

  innerScrollTo(0)
})

function innerScrollTo(position: number) {
  scrollTo({ top: position })
}

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
  let newTopPosition = -scrollY.value * 3
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

const artistes: artistesProps[] = [
  { name: 'Antmo', description: 'description', imgUrls: [] },
  { name: 'Mira', description: 'description', imgUrls: [] },
  { name: 'Ronnie', description: 'description', imgUrls: [] },
]
</script>

<template>
  <header class="w-100 flex flex-center" :style="{ height: headerHeight + 'px' }">
    <animatedBg :animated="isBgAnimated"></animatedBg>
    <div id="layout" class="h-100 w-100 no-events"></div>
    <div
      id="navHeader"
      class="w-100 flex flex-row flex-wrap flex-between flex-align-center no-events"
    >
      <div
        id="titleContainer"
        class="flex flex-center"
        :style="{ width: (navHeaderContainersSize ?? 100) + '%' }"
        @click="() => innerScrollTo(0)"
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
              label="Roster"
              animation="slide-in"
              @click="innerScrollTo(300)"
            ></animatedLink>
          </li>
          <li class="nav-item">
            <animatedLink
              :animated="isHeaderAnimationRunning"
              classes="nav-link underlign"
              label="Events"
              animation="slide-in"
              @click="innerScrollTo(974)"
            ></animatedLink>
          </li>
          <li class="nav-item">
            <animatedLink
              :animated="isHeaderAnimationRunning"
              classes="nav-link underlign"
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
    <div id="container" class="w-100">
      <div id="content" class="w-100">
        <section id="roster" class="w-100">
          <h1>Roster</h1>
          <carouselComponent :items="artistes">
            <ArtistItem
              v-for="artiste in artistes"
              :key="artiste.name"
              :name="artiste.name"
              :description="artiste.description"
              :imgUrls="artiste.imgUrls"
              :backGroundVideoUrl="artiste.backGroundVideoUrl"
              class="carouselItem"
            ></ArtistItem>
          </carouselComponent>
        </section>
        <section id="events">
          <h1>Events</h1>
          <carouselComponent :items="[]"></carouselComponent>
        </section>
      </div>
    </div>
  </main>

  <footer class="flex flex-center flex-align-center w-100">
    <div id="iconsContainer" class="flex flex-around flex-align-center h-100">
      <a class="flex flex-center flex-align-center"><i class="bi bi-instagram"></i></a>
      <a class="flex flex-center flex-align-center"><i class="bi bi-envelope-at"></i></a>
    </div>
  </footer>
</template>

<style lang="scss">
@import './assets/main.scss';
@import '../node_modules/bootstrap-icons/font/bootstrap-icons.min.css';

header {
  z-index: 10;
  position: fixed;

  p {
    margin: 0px;
  }

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
      cursor: pointer;
      margin: 0;
      padding: 0;
    }

    .navbar {
      margin-left: v-bind(navLeftMargin);
      background: none;

      .nav-link {
        font-size: v-bind(linkFontSize);
        color: $color;
        pointer-events: visible;
      }
    }
  }
}

main {
  #container {
    min-height: 1500px;

    #content {
      section {
        width: 100%;
        height: calc(100vh - 150px - 15vw);
        margin-top: 4vw;

        #carouselContainer {
          height: 90%;
        }
      }

      @media (min-width: 1250px) {
        section {
          padding-left: 15%;
          padding-right: 15%;
        }
      }
    }
  }
}

footer {
  position: fixed;
  bottom: 0px;
  height: 40px;

  #iconsContainer {
    position: relative;
    bottom: -75%;
    width: 200px;
    margin: auto;

    background-color: $bg-color;
    border-radius: 10px 10px 0px 0px;

    transition: bottom ease-in-out 0.1s;

    &:hover {
      bottom: 0%;
      a {
        bottom: 0%;
      }
    }

    a {
      transition: bottom ease-in-out 0.2s;
      position: relative;
      bottom: -100%;
      width: 16px;
      height: 16px;

      i {
        transition: font-size ease-in-out 0.07s;

        font-size: 1.5rem;

        &:hover {
          font-size: 1.8rem;
        }
      }
    }
  }
}
</style>
