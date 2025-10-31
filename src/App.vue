<script setup lang="ts">
import animatedBg from './components/animatedBg/animatedBg.vue'
import { ref } from 'vue'
import animatedLink from './components/leftRightAnimated.vue'
import animatedText from './components/animatedText.vue'
import artistItem from './components/artistItem.vue'
import { ANIMATION } from '@/tools/tools'

const TITLE_FONT_SIZE = 12
const LINK_FONT_SIZE = 3

const titleFontSize = TITLE_FONT_SIZE + 'vw'
const linkFontSize = LINK_FONT_SIZE + 'vw'
const navLeftMargin = TITLE_FONT_SIZE / 10 + 'vw'

const mousePos = ref({ x: -1, y: -1 })
const scrollY = ref(0)

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

  console.log(scrollY.value)
}
</script>

<template>
  <header class="w-100 h-100 flex flex-center flex-align-center" @scroll="updateScrollY">
    <animatedBg></animatedBg>
    <div class="wrapper flex flex-center flex-align-center flex-column">
      <animatedText
        label="KRAM AGENCY"
        :fontSize="titleFontSize"
        containerClasses="titleContainer"
        textClasses="title"
        :onMontedAnimation="ANIMATION.randomstep"
        :onHoverLetterAnimation="ANIMATION.grow"
      ></animatedText>
      <nav class="navbar w-100">
        <ul class="navbar-nav w-100 flex flex-row flex-between">
          <li class="nav-item">
            <animatedLink
              classes="nav-link underlign"
              href="#Roster"
              label="Roster"
              animation="slide-in"
            ></animatedLink>
          </li>
          <li class="nav-item">
            <animatedLink
              classes="nav-link underlign"
              href="#Events"
              label="Events"
              animation="slide-in"
            ></animatedLink>
          </li>
          <li class="nav-item">
            <animatedLink
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

  <main class="w-100" @mousemove="updateMousePosition" @mouseout="resetMousePosition">
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
  position: relative;
  overflow-x: hidden;

  .wrapper {
    position: absolute;

    .title {
      white-space: pre;
      pointer-events: visible;
      line-height: 10vw;
      height: 10vw;
      margin: 0;
      padding: 0;
    }

    .navbar {
      transition: all ease-in-out 1s 1s;

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
  #container {
    width: 100%;

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
