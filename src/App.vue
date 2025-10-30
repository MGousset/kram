<script setup lang="ts">
import animatedBg from './components/animatedBg/animatedBg.vue'
import { ref } from 'vue'
import AnimatedLink from './components/animatedLink.vue'
import AnimatedText from './components/animatedText.vue'

const TITLE_FONT_SIZE = 12
const LINK_FONT_SIZE = 3

const titleFontSize = TITLE_FONT_SIZE + 'vw'
const linkFontSize = LINK_FONT_SIZE + 'vw'
const navLeftMargin = TITLE_FONT_SIZE / 10 + 'vw'

const mousePos = ref({ x: -1, y: -1 })

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
</script>

<template>
  <animatedBg></animatedBg>
  <header class="w-100 h-100 flex flex-center flex-align-center">
    <div class="wrapper">
      <AnimatedText
        label="KRAM AGENCY"
        containerClasses="titleContainer"
        textClasses="title"
      ></AnimatedText>
      <nav class="navbar w-100">
        <ul class="navbar-nav w-100 flex flex-row flex-between">
          <li class="nav-item">
            <AnimatedLink
              classes="nav-link underlign"
              href="#Artiste"
              label="Artiste"
              animation="slide-in"
            ></AnimatedLink>
          </li>
          <li class="nav-item">
            <AnimatedLink
              classes="nav-link underlign"
              href="#Events"
              label="Events"
              animation="slide-in"
            ></AnimatedLink>
          </li>
          <li class="nav-item">
            <AnimatedLink
              classes="nav-link underlign"
              href="#Contact"
              label="Contact"
              animation="slide-in"
            ></AnimatedLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="w-100 h-100" @mousemove="updateMousePosition" @mouseout="resetMousePosition">
    <div id="container" class="h-100">
      <div id="content" class="h-100"></div>
    </div>
  </main>
</template>

<style lang="scss">
@import './assets/main.scss';

header {
  position: absolute;
  pointer-events: none;

  .titleContainer {
  }

  .title {
    white-space: pre;
    pointer-events: visible;
    line-height: 10vw;
    font-size: v-bind(titleFontSize);
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

main {
  padding: 2rem;

  #container {
    padding-top: 100px;
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
