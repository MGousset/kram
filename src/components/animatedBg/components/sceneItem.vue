<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { getDefaultUniforms, initScene } from './tools'
import { fragment, vertex } from './shaders'

import * as THREE from 'three'
import { generateRandomColor, hexToRgb } from '@/tools/tools'
import { useWindowSize } from '@vueuse/core'

const COLOR_MAIN = ref('a28af1')

const AMP_MULTIPLIER = 1.4
const C_SPEED_MULTIPLIER = 6
const MESH_SIZE = 3.5
const BASE_ROTATION = -Math.PI / 2.4
const Y_TRANSLATION = -0.3
const CAM_FOG = 10
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
const aspectRation = computed(() => width.value / height.value)
const { scene, camera } = initScene(backgroundColor, aspectRation.value, CAM_FOG)

function updateRatio(): void {
  camera.aspect = aspectRation.value
  camera.updateProjectionMatrix()

  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.render(scene, camera)
}

watch(aspectRation, updateRatio)

const uniforms = {
  ...getDefaultUniforms(),
  u_pointsize: { value: 2.0 },
  // Wave 1

  u_noise_freq_1: { value: 3.0 },
  u_noise_amp_1: { value: 0.2 * AMP_MULTIPLIER },
  u_spd_modifier_1: { value: 1.0 },
  // Wave 2
  u_noise_freq_2: { value: 2.0 },
  u_noise_amp_2: { value: 0.3 * AMP_MULTIPLIER },
  u_spd_modifier_2: { value: 0.8 },

  // Colors
  u_bgMain: { value: hexToRgb(COLOR_MAIN.value) },
  u_color1: { value: generateRandomColor() },
  u_color2: { value: generateRandomColor() },
  u_color3: { value: generateRandomColor() },
  u_color4: { value: generateRandomColor() },

  u_cspd_modifier_1: { value: 0.08 * C_SPEED_MULTIPLIER },
  u_cspd_modifier_2: { value: 0.1 * C_SPEED_MULTIPLIER },
  u_cspd_modifier_3: { value: 0.06 * C_SPEED_MULTIPLIER },
  u_cspd_modifier_4: { value: 0.2 * C_SPEED_MULTIPLIER },
}

/** Create Mesh */
const vertexShader = vertex
const fragmentShader = fragment

const plan = new THREE.PlaneGeometry(MESH_SIZE, MESH_SIZE, 200, 200)
const materiel = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: uniforms,
  wireframe: false,
})

const mesh = new THREE.Mesh(plan, materiel)

mesh.rotation.z = Math.PI / 4
mesh.rotation.x = BASE_ROTATION

mesh.translateOnAxis(new THREE.Vector3(1, 1, 0), Y_TRANSLATION)

scene.add(mesh)

// The engine that powers your scene into movement
const clock = new THREE.Clock()
const animate = async (): Promise<void> => {
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

  updateRatio()
  // animate()
})

function randomColor(): void {
  uniforms.u_bgMain.value = generateRandomColor()
  uniforms.u_color1.value = generateRandomColor()
  uniforms.u_color2.value = generateRandomColor()
  uniforms.u_color3.value = generateRandomColor()
  uniforms.u_color4.value = generateRandomColor()

  renderer.render(scene, camera) // TO remove when animate
}

function wireframeSwitch(): void {
  materiel.wireframe = !materiel.wireframe

  renderer.render(scene, camera) // TO remove when animate
}
</script>

<template>
  <canvas ref="renderCanvas" @click.left="randomColor" @click.right.prevent="wireframeSwitch">
  </canvas>
</template>
