<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getDefaultUniforms, initScene } from './tools'
import { noiseVertex, noiseFragment } from './shaders'

import * as THREE from 'three'
import { generateRandomColor } from '@/tools/tools'

const MESH_SIZE = 2
const CAM_FOG = 10

/** Define props */
type sceneProps = {
  animated: boolean
  bgColors: { color1: THREE.Color; color2: THREE.Color }
}
const {
  animated = true,
  bgColors = {
    color1: new THREE.Color(247, 175, 193),
    color2: new THREE.Color(246, 137, 139),
  },
} = defineProps<sceneProps>()

/** Define const */
let renderer = new THREE.WebGLRenderer()
const renderCanvas = ref<HTMLCanvasElement | null>(null)

const { scene, camera } = initScene(CAM_FOG)

/** Render when component is in DOM */
onMounted(() => {
  renderer = new THREE.WebGLRenderer({
    canvas: renderCanvas.value ?? undefined,
    antialias: true,
  })

  renderer.setSize(screen.width, screen.height)
  renderer.setPixelRatio(window.devicePixelRatio)

  if (animated) {
    animate()
  } else {
    renderer.render(scene, camera)
  }
})

const uniforms = {
  ...getDefaultUniforms(),
  u_pointsize: { value: 2.0 },

  // Colors
  u_color1: { value: bgColors.color1 },
  u_color2: { value: bgColors.color2 },
}

/** Create Mesh */
const vertexShader = noiseVertex
const fragmentShader = noiseFragment

const plan = new THREE.PlaneGeometry(MESH_SIZE, MESH_SIZE, 1, 1)
const materiel = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: uniforms,
  wireframe: false,
})

const mesh = new THREE.Mesh(plan, materiel)
scene.add(mesh)

// The engine that powers your scene into movement
const clock = new THREE.Clock()
let time = 0
const animate = async (): Promise<void> => {
  requestAnimationFrame(animate)
  if (!animated) {
    if (clock.running) {
      clock.stop()
    }
    return
  }
  if (!clock.running) {
    clock.startTime = clock.oldTime
    clock.start()
  }

  const delta = clock.getDelta()
  time += delta
  if (time >= 600) {
    time = 0
    clock.stop()
    clock.start()
  }

  uniforms.u_color1 = { value: bgColors.color1 }
  uniforms.u_color2 = { value: bgColors.color2 }

  uniforms.u_time.value = Math.sin(time / 600)
  renderer.render(scene, camera)
}

function randomColor(): void {
  uniforms.u_color1.value = generateRandomColor()
  uniforms.u_color2.value = generateRandomColor()

  if (!animated) {
    renderer.render(scene, camera)
  }
}
</script>

<template>
  <canvas ref="renderCanvas" @click.left="randomColor"></canvas>
</template>
