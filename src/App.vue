<script setup lang="ts">
import * as THREE from 'three'
import { defineAsyncComponent, onMounted, ref } from 'vue'
import { ANIMATION } from '@/tools/tools'
import { artistes, colorByImageUrl } from './const'

import AnimatedText from './components/animatedText.vue'
import LeftRightAnimated from './components/leftRightAnimated.vue'
import AnimatedBg from './components/animatedBg/animatedBg.vue'

const ArtistItem = defineAsyncComponent(() =>
  import('./components/artistItem.vue').then((comp) => {
    afterLoaded()
    return comp
  }),
)

const isBgAnimated = ref(true) // TODO put false for dev
const linkOpacity = ref(0)

const defaultbgColors = {
  color1: new THREE.Color(247, 175, 193),
  color2: new THREE.Color(246, 137, 139),
}
const bgColors = ref(defaultbgColors)

let isTitleAnimationEnded = false
function setTitleAnimation(): void {
  isTitleAnimationEnded = true
}

async function afterLoaded(): Promise<void> {
  if (!isTitleAnimationEnded) {
    await new Promise((f) => setTimeout(f, 200))
    return afterLoaded()
  }

  await centerArtistItems()
  linkOpacity.value = 1
}

onMounted(() => {
  innerScrollTo(0)
  window.addEventListener('resize', centerArtistItems)
})

const animationCount = ref(0)
const isAtTop = ref(false)
function innerScrollTo(position: number): void {
  animationCount.value += 1
  isAtTop.value = position === 0
  scrollTo({ top: position })
}

async function centerArtistItems(): Promise<void> {
  const artistsMosaiqContainer = document.getElementById('artistsMosaiqContainer')
  if (!artistsMosaiqContainer) {
    await new Promise((f) => setTimeout(f, 200))
    return centerArtistItems()
  }

  const artistItems = artistsMosaiqContainer.getElementsByClassName(
    'artistItem',
  ) as HTMLCollectionOf<HTMLDivElement>
  if (!artistItems.length) {
    await new Promise((f) => setTimeout(f, 200))
    return centerArtistItems()
  }

  const minWidth = 300
  const maxWidth = 450
  const minMargin = 16
  const containerWidth = artistsMosaiqContainer.clientWidth - minMargin

  const itemsByRow = Math.min(
    Math.floor(containerWidth / (minWidth + minMargin * 2)),
    artistItems.length,
  )

  const itemWidth = Math.min(containerWidth / itemsByRow - minMargin, maxWidth)
  const marginLeft = Math.max(
    (containerWidth - itemsByRow * itemWidth) / (itemsByRow + 1),
    minMargin,
  )

  for (const artistItem of artistItems) {
    artistItem.style.width = itemWidth + 'px'
    artistItem.style.marginLeft = marginLeft + 'px'
  }
}

function changeBgColors(p: { id?: string; isClicked: boolean }): void {
  const { id, isClicked } = p
  if (isClicked) {
    return
  }

  if (!id) {
    bgColors.value = defaultbgColors
    return
  }

  const colors = colorByImageUrl.get(id)
  if (!colors) {
    return
  }
  bgColors.value = colors
}
</script>

<template>
  <div
    id="navBar"
    class="fixed flex flex-row flex-between flex-align-end"
    :class="{ up: !isAtTop }"
    :style="{ opacity: linkOpacity }"
  >
    <LeftRightAnimated :animated="true" animation="leftRight">
      <a @click="() => innerScrollTo(0)"><h2>KRAM</h2></a>
    </LeftRightAnimated>
    <LeftRightAnimated :animated="true" animation="rightLeft">
      <a @click="() => innerScrollTo(1080)"><h2>ARTISTES</h2></a>
    </LeftRightAnimated>
  </div>
  <header class="color">
    <AnimatedBg
      :animated="isBgAnimated"
      :bgColors="bgColors"
      class="h-100 w-100 absolute"
    ></AnimatedBg>
    <div id="layout" class="h-100 w-100 absolute no-events"></div>
    <div id="navHeader" class="w-100 flex" :class="{ up: !isAtTop }">
      <div
        id="titleContent"
        class="w-100 flex flex-center flex-align-center"
        @click="() => innerScrollTo(0)"
      >
        <AnimatedText
          :animated="true"
          label="KRAM AGENCY"
          :fontSize="9"
          containerClasses="titleContent"
          textClasses="title"
          :onMontedAnimation="ANIMATION.randomstep"
          :onHoverLetterAnimation="ANIMATION.grow"
          @finished="() => setTitleAnimation()"
        ></AnimatedText>
      </div>
    </div>
  </header>

  <main id="main" class="w-100 relative">
    <div id="container" class="w-100">
      <div id="content" class="w-100">
        <section id="rosterSection" class="w-100">
          <div class="w-100 flex flex-center flex-align-center flex-column sectionContainer">
            <div class="flex flex-center flex-align-center sectionHeader flex-1">
              <h2>ARTISTES</h2>
            </div>
            <div
              id="artistsMosaiqContainer"
              class="w-100 flex flex-row flex-align-center flex-wrap sectionContent flex-2"
            >
              <ArtistItem
                v-for="artiste in artistes"
                :key="artiste.name"
                :name="artiste.name"
                :description="artiste.description"
                :imgUrl="artiste.imgUrl"
                :styles="artiste.styles"
                :network="artiste.network"
                :trackIds="artiste.trackIds"
                classes="artistItem"
                @focus-image="(p: { id: string; isClicked: boolean }) => changeBgColors(p)"
              ></ArtistItem>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>

  <footer class="flex flex-center flex-align-center w-100">
    <div id="iconsContainer" class="flex flex-around flex-align-center h-100">
      <a
        class="flex flex-center flex-align-center"
        target="_blank"
        href="https://www.instagram.com/krambzh/"
      >
        <i class="fa fa-instagram" aria-hidden="true"></i>
      </a>
      <a
        class="flex flex-center flex-align-center"
        target="_blank"
        href="mailto:contact@kram-agency.com"
        ><i class="fa fa-envelope" aria-hidden="true"></i
      ></a>
    </div>
  </footer>
</template>

<style lang="scss">
@import './assets/main.scss';

@keyframes up {
  from {
    top: 50%;
  }

  to {
    top: -10%;
  }
}

#navBar {
  transition: all ease-in-out 0.3s;

  &.up {
    top: 5%;
  }

  z-index: 100;
  width: 25rem;
  left: 50%;
  top: 65%;
  transform: translate(-50%, -50%);
  padding: 1rem 2rem 1rem 2rem;

  a {
    cursor: pointer;
    margin-right: 1rem;

    color: rgba(255, 255, 255, 0.7);

    &:hover {
      color: rgba(255, 255, 255, 1);
    }
  }
}

header {
  background-color: aqua;
  height: 100vh;
  z-index: 0;
  position: sticky;
  top: 0px;

  p {
    margin: 0px;
  }

  #layout {
    z-index: -9;
    background-color: rgba(0, 0, 0, 0.3);
    background-image: url('./assets/noise.svg');
  }

  #navHeader {
    transition: all ease-in-out 0.3s;

    transform: translate(-50%, -50%);
    position: relative;
    top: 50%;
    left: 50%;

    &.up {
      top: -10%;
    }

    #titleContent {
      padding: 5rem;

      .title {
        white-space: pre;
        pointer-events: visible;
        cursor: pointer;
        margin: 0;
        padding: 0;
      }
    }
  }
}

main {
  z-index: 1;
  #container {
    overflow-x: hidden;

    #content {
      section {
        .sectionContainer {
          position: relative;
          height: 100vh;
          background-color: rgb(0, 0, 0, 0.1);
          padding-bottom: 3rem;

          .sectionHeader {
            color: $color;
            height: 9rem;
            margin: auto;

            h2 {
              padding-top: 3rem;
            }
          }

          .sectionContent {
            position: relative;
            border-radius: 5px;
            overflow-y: auto;

            &::-webkit-scrollbar {
              width: 12px; /* width of the entire scrollbar */
            }

            &::-webkit-scrollbar-track {
              background: #181818; /* color of the tracking area */
            }

            &::-webkit-scrollbar-thumb {
              background-color: white; /* color of the scroll thumb */
              border-radius: 5px; /* roundness of the scroll thumb */
              border: 3px solid #181818; /* creates padding around scroll thumb */
            }
          }
        }
      }

      #rosterSection {
        .artistItem {
          z-index: 1;
          aspect-ratio: 1;
          height: fit-content;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }

      .carouselArtist__class {
        //background-color: lime;
        //opacity: 0.5;
        width: 100%;
        height: 660px;
        overflow: hidden;
      }
    }
  }
}

footer {
  position: fixed;
  z-index: 100;
  bottom: 0px;
  height: 40px;

  #iconsContainer {
    position: relative;
    bottom: -50%;
    width: 250px;
    margin: auto;

    border-radius: 10px 10px 0px 0px;

    transition: bottom ease-in-out 0.1s;
    transition: background-color ease-in-out 0.1s;
    background-color: rgba(255, 255, 255, 0.7);

    &:hover {
      bottom: 0%;
      background-color: rgba(255, 255, 255, 1);
      a {
        bottom: 0%;
      }
    }

    a {
      color: $color-inverse;
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
