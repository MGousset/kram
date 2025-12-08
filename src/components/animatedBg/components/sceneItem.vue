<script setup lang="ts">
import { computed, onMounted, ref, render, watch } from 'vue'
import { getDefaultUniforms, initScene } from './tools'
import { noiseVertex, noiseFragment } from './shaders'

import * as THREE from 'three'
import { useScreenOrientation, useWindowSize } from '@vueuse/core'
import { step } from 'three/tsl'

const MESH_SIZE = 5

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
const { width, height } = useWindowSize()
const { orientation } = useScreenOrientation()

let renderer = new THREE.WebGLRenderer()
const renderCanvas = ref<HTMLCanvasElement | null>(null)

const aspectRatio = computed(() => width.value / height.value)
const { scene, camera } = initScene(aspectRatio.value)

/** Create Mesh */
const vertexShader = noiseVertex
const fragmentShader = noiseFragment

const uniforms = {
  ...getDefaultUniforms(),

  // Colors
  u_color1: { value: bgColors.color1 },
  u_color2: { value: bgColors.color2 },

  u_frag: { value: new THREE.Vector4(0, 0, 0, 0) },

  u_resolution: {
    value: {
      x: 1080,
      y: 1080 * aspectRatio.value,
    },
  },
}

const plan = new THREE.PlaneGeometry(MESH_SIZE, MESH_SIZE, 1, 1)
const materiel = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: uniforms,
  wireframe: false,
})
const mesh = new THREE.Mesh(plan, materiel)

watch(aspectRatio, () => onResise())
watch(orientation, () => onResise())

function onResise(): void {
  camera.left = -1 * aspectRatio.value
  camera.bottom = 1 * aspectRatio.value

  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(aspectRatio.value)

  uniforms.u_resolution.value = {
    x: 1080,
    y: 1080 * aspectRatio.value,
  }

  renderer.render(scene, camera)
}

/** Render when component is in DOM */
onMounted(() => {
  renderer = new THREE.WebGLRenderer({
    canvas: renderCanvas.value ?? undefined,
  })

  renderer.setSize(width.value, height.value)
  renderer.setPixelRatio(aspectRatio.value)

  scene.add(mesh)
  renderer.render(scene, camera)

  if (animated) {
    animate()
  }
})

// The engine that powers your scene into movement
const stepDuration = 1
const animate = async (): Promise<void> => {
  requestAnimationFrame(animate)

  uniforms.u_color1 = { value: bgColors.color1 }
  uniforms.u_color2 = { value: bgColors.color2 }

  uniforms.u_time.value += stepDuration / 5000
  renderer.render(scene, camera)

  await new Promise((f) => setTimeout(f, stepDuration * 100))
}
</script>

<template>
  <canvas ref="renderCanvas"></canvas>
</template>
