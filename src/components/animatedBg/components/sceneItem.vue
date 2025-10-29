<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getDefaultUniforms, initScene } from './tools'
import { fragment, vertex } from './shaders'

import { useWindowSize } from '@vueuse/core'
import * as THREE from 'three'

/** Define props */
type sceneProps = {
  backgroundColor?: THREE.ColorRepresentation
  meshColor?: THREE.ColorRepresentation
}
const { backgroundColor = 'red', meshColor = 'white' } = defineProps<sceneProps>()

/** Define const */
let renderer = new THREE.WebGLRenderer()
const renderCanvas = ref<HTMLCanvasElement | null>(null)

const { width, height } = useWindowSize()
const aspectRatio = computed(() => width.value / height.value)
const { scene, camera } = initScene(backgroundColor, aspectRatio.value)

const uniforms = {
  ...getDefaultUniforms(),
  u_pointsize: { value: 2.0 },
  // wave 1
  u_noise_freq_1: { value: 3.0 },
  u_noise_amp_1: { value: 0.2 },
  u_spd_modifier_1: { value: 1.0 },
  // wave 2
  u_noise_freq_2: { value: 2.0 },
  u_noise_amp_2: { value: 0.3 },
  u_spd_modifier_2: { value: 0.8 },
}

const lenght = 4
const mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(lenght, lenght, 128, 128),
  new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: uniforms,
    wireframe: true,
  }),
)

mesh.rotation.z = Math.PI / 4
mesh.rotation.x = -Math.PI / 4

mesh.translateOnAxis(new THREE.Vector3(1, 1, 0), lenght / 20)

scene.add(mesh)

// The engine that powers your scene into movement
const clock = new THREE.Clock()
const animate = (): void => {
  requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()
  uniforms.u_time.value = elapsed / 4

  renderer.render(scene, camera)
}

/** Render when component is in DOM */
onMounted(() => {
  renderer = new THREE.WebGLRenderer({
    canvas: renderCanvas.value ?? undefined,
    antialias: true,
  })
  renderer.setSize(width.value, height.value)
  animate()
})

function clockSwitch(): void {
  if (clock.running) {
    clock.stop()
  } else {
    clock.start()
  }
}

function rotatePlan(mousePos: { x: number; y: number }): void {
  const midScreenX = width.value / 2
  const midScreenY = height.value / 2

  const xRatio = (mousePos.x - midScreenX) / midScreenX
  const yRatio = (mousePos.y - midScreenY) / midScreenY

  mesh.rotation.y = (xRatio * Math.PI) / 16
  mesh.rotation.x = -Math.PI / 4 + (yRatio * Math.PI) / 16
}
</script>

<template>
  <canvas ref="renderCanvas" @click="clockSwitch" @mousemove="rotatePlan"> </canvas>
</template>
