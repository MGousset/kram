import * as THREE from 'three'

export function initScene(aspectRatio: number): {
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
} {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(255, 0, 0)

  const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 2, -2, 0, 100000)
  camera.position.z = 2

  scene.add(camera)

  return { scene, camera }
}

export const getDefaultUniforms = () => {
  return {
    u_time: { value: 0.0 },
    u_mouse: {
      value: {
        x: 0.0,
        y: 0.0,
      },
    },
  }
}
