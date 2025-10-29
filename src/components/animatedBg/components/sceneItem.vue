<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getDefaultUniforms, initScene } from './tools'
import { fragment, vertex } from './shaders'

import { useWindowSize } from '@vueuse/core'
import * as THREE from 'three'
import { generateRandomColor, hexToRgb } from '@/tools/tools'

const COLOR_MAIN = ref('a28af1')
const COLOR_1 = ref('a28af1')
const COLOR_2 = ref('531ff1')

const AMP_MULTIPLIER = 1.4
const MESH_SIZE = 4
const BASE_ROTATION = -Math.PI / 2.5
const Y_TRANSLATION = 0
const FACTOR_RATIO = 50
const CAM_FOG = 11
const TIME_FRACTOR = 15

/** Define props */
type sceneProps = {
  backgroundColor?: THREE.ColorRepresentation
}
const { backgroundColor = 'red' } = defineProps<sceneProps>()

/** Define const */
let renderer = new THREE.WebGLRenderer()
const renderCanvas = ref<HTMLCanvasElement | null>(null)

const { width, height } = useWindowSize()
const aspectRatio = computed(() => width.value / height.value)
const { scene, camera } = initScene(backgroundColor, aspectRatio.value, CAM_FOG)

const uniforms = {
  ...getDefaultUniforms(),
  u_pointsize: { value: 2.0 },
  // wave 1
  u_noise_freq_1: { value: 3.0 },
  u_noise_amp_1: { value: 0.2 * AMP_MULTIPLIER },
  u_spd_modifier_1: { value: 1.0 },
  // wave 2
  u_noise_freq_2: { value: 2.0 },
  u_noise_amp_2: { value: 0.3 * AMP_MULTIPLIER },
  u_spd_modifier_2: { value: 0.8 },

  u_bgMain: { value: hexToRgb(COLOR_MAIN.value) },
  u_color1: { value: hexToRgb(COLOR_1.value) },
  u_color2: { value: hexToRgb(COLOR_2.value) },
}

/** Create Mesh */
const vertexShader = vertex
const fragmentShader = fragment

const plan = new THREE.PlaneGeometry(MESH_SIZE, MESH_SIZE, 128, 128)
const materiel = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: uniforms,
  wireframe: true,
})

const mesh = new THREE.Mesh(plan, materiel)

mesh.rotation.z = Math.PI / 4
mesh.rotation.x = BASE_ROTATION

mesh.translateOnAxis(new THREE.Vector3(1, 1, 0), Y_TRANSLATION)

scene.add(mesh)

// The engine that powers your scene into movement
const clock = new THREE.Clock()
const animate = (): void => {
  requestAnimationFrame(animate)

  const elapsed = clock.getElapsedTime()
  uniforms.u_time.value = elapsed / TIME_FRACTOR

  renderer.render(scene, camera)
}

/** Render when component is in DOM */
onMounted(() => {
  renderer = new THREE.WebGLRenderer({
    canvas: renderCanvas.value ?? undefined,
    antialias: true,
  })
  renderer.setSize(width.value, height.value)
  renderer.render(scene, camera)
})

function randomColor(): void {
  uniforms.u_bgMain.value = generateRandomColor()
  uniforms.u_color1.value = generateRandomColor()
  uniforms.u_color2.value = generateRandomColor()
}

function wireframeSwitch(): void {
  materiel.wireframe = !materiel.wireframe
}
</script>

<template>
  <canvas ref="renderCanvas" @click.left="randomColor" @click.right.prevent="wireframeSwitch">
  </canvas>
</template>
