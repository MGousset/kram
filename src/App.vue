<script setup lang="ts">
import animatedBg from './components/animatedBg/animatedBg.vue'
import { createApp, onMounted, ref } from 'vue'
import animatedLink from './components/leftRightAnimated.vue'
import animatedText from './components/animatedText.vue'
import carouselComponent from './components/autoPhotoCarousel.vue'
import { ANIMATION } from '@/tools/tools'
import { useWindowSize } from '@vueuse/core'
import ArtistItem from './components/artistItem.vue'
import type { artistesProps } from './components/artistItem.vue'
import type { carouselProps } from './components/carouselArtiste/carouselArtist.vue'
import AutoPhotoCarousel from './components/autoPhotoCarousel.vue'
import { artistes } from './const'
import carouselArtist from './components/carouselArtiste/carouselArtist.vue'

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
const appTopPosition = ref(headerHeight.value)
const headerSectionWidth = ref(0 + '%')

onMounted(() => {
  document.addEventListener('scroll', updateScrollY)
  document.addEventListener('wheel', updateScrollY)
  window.addEventListener('resize', updateBottomPosition)

  window.addEventListener('resize', centerArtistItems)
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
    if (topPosition.value <= minTopPosition) {
      return
    }
    centerArtistItems()
    // Stop bg animation if top is reached
    isBgAnimated.value = false
    newTopPosition = minTopPosition
    // Restart header animation
    isHeaderAnimationRunning.value = true
    appTopPosition.value = headerHeight.value + scrollY.value
  } else {
    // isBgAnimated.value = true // TODO comment for dev
    if (newTopPosition === 0) {
      isHeaderAnimationRunning.value = true // Restarts header animation at start position
    } else {
      appTopPosition.value = headerHeight.value + scrollY.value
      isHeaderAnimationRunning.value = false // Stops header animations during transition
    }
  }
  topPosition.value = newTopPosition
  const animationProgression = (minTopPosition - topPosition.value) / minTopPosition

  updateHeaderHeight(animationProgression)
  updateTitleFontSize(animationProgression)
  updateNavHeaderContainersSize(animationProgression)
  updateSectionHeaderWidth(animationProgression)
}

function updateHeaderHeight(animationProgression: number): void {
  headerHeight.value = minVisibleHeight + (maxHeigh - minVisibleHeight) * animationProgression
}

function updateTitleFontSize(animationProgression: number): void {
  const startValue = TITLE_FONT_SIZE
  const endValue = LINK_FONT_SIZE
  titleFontSize.value = endValue + (startValue - endValue) * animationProgression
}

function updateNavHeaderContainersSize(animationProgression: number): void {
  const startValue = 100
  const endValue = 45
  navHeaderContainersSize.value = endValue + (startValue - endValue) * animationProgression
}

function updateSectionHeaderWidth(animationProgression: number): void {
  const startValue = 0
  const endValue = 100
  headerSectionWidth.value = endValue + (startValue - endValue) * animationProgression + '%'
}

function centerArtistItems(): void {
  const artistsContainer = document.getElementById('artistsContainer')
  if (!artistsContainer) {
    return
  }

  const artistItems = artistsContainer.getElementsByClassName(
    'artistItem',
  ) as HTMLCollectionOf<HTMLDivElement>
  if (!artistItems.length) {
    return
  }

  const itemWidth = artistItems[0]?.clientWidth
  if (!itemWidth) {
    return
  }

  const containerWidth = artistsContainer.clientWidth
  const minMargin = 20
  const itemsByRow = Math.floor(containerWidth / (itemWidth + minMargin * 2))
  const marginLeft = Math.max((containerWidth - itemsByRow * itemWidth) / (itemsByRow + 1) - 1, 5)

  for (const artistItem of artistItems) {
    artistItem.style.marginLeft = marginLeft + 'px'
  }
}

const artistesBgImgUrls = ['/src/img/bg-1.jpg']
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
    </div>
  </header>

  <main
    id="main"
    class="w-100 relative"
    @mousemove="updateMousePosition"
    @mouseout="resetMousePosition"
    :style="{ top: appTopPosition + 'px' }"
  >
    <div id="container" class="w-100">
      <div id="content" class="w-100">
        <section id="rosterSection" class="w-100">
          <div class="flex flex-center flex-align-center sectionHeader">
            <h2>ARTISTES</h2>
          </div>
          <div class="w-100 sectionContent flex flex-align-center flex-center">
            <div id="artistsContainer" class="w-100 flex flex-row">
              <ArtistItem
                v-for="artiste in artistes"
                :key="artiste.name"
                :name="artiste.name"
                :description="artiste.description"
                :imgUrl="artiste.imgUrl"
                :trackIds="artiste.trackIds"
                :styles="artiste.styles"
                classes="artistItem"
              ></ArtistItem>
            </div>
          </div>
          <carouselArtist id="carrouselTest"
            :artistes="artistes"
          />
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
  position: relative;
  #container {
    background-color: $bg-color;

    #content {
      section {
        width: 100%;
        min-height: calc(100vh - 150px);

        .sectionHeader {
          background-color: $sectionHeader-bg-color;
          height: 100px;
          width: v-bind(headerSectionWidth);
          margin: auto;

          h2 {
            color: white !important;
          }
        }

        .sectionContainer {
          position: relative;
          min-height: calc(100vh - 150px - 100px);
          background-color: white;

          padding-top: 2rem;
          padding-bottom: 2rem;
          .sectionContent {
            height: calc(100% - 200px);
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }
      }

      @media (min-width: 1250px) {
        .sectionContent {
          padding-left: 10%;
          padding-right: 10%;
        }
      }

      #rosterSection {
        .sectionContent {
          .artistesBgImgs {
            position: absolute;
            height: 100%;

            filter: grayscale(1);
          }
        }
      }

      #carrouselTest {
        position: relative;
        background-color: lime;
        opacity: 0.3;
        width: 100%;
        height: 800px;
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
    bottom: -50%;
    width: 250px;
    margin: auto;

    background-color: $sectionHeader-bg-color;
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
