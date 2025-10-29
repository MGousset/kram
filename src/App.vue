<script setup lang="ts">
import animatedBg from './components/animatedBg/animatedBg.vue'
import { ref } from 'vue'

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
  <header class="w-100">
    <div class="wrapper">
      <h1>KRAM AGENCY</h1>
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
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100px;

  background-color: rgba(0, 0, 0, 0.5);

  h1 {
    color: $color;
  }
}

main {
  padding: 2rem;

  #container {
    padding-top: 100px;
    width: 100%;

    #content {
      position: relative;
      height: 100%;
      border: 5px $border-color solid;
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
