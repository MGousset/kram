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
      <h1>On est là</h1>
    </div>
  </header>

  <main class="w-100 h-100" @mousemove="updateMousePosition" @mouseout="resetMousePosition">
    <div id="container"></div>
  </main>
</template>

<style>
header {
  position: absolute;
}

main {
  padding: 2rem;

  #container {
    position: relative;
    top: 60px;
    height: 500px;
    width: 100%;
    /* border: 1px white solid; */
  }

  @media (min-width: 1250px) {
    #container {
      width: 70%;
      margin: auto;
    }
  }
}
</style>
