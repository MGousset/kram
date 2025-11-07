import * as THREE from 'three'

export function initScene(cam_fog: number): {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
} {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(255, 0, 0)

  const camera = new THREE.PerspectiveCamera(cam_fog, screen.width / screen.height, 0.1, 1000)
  camera.position.z = 5

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
    u_resolution: {
      value: {
        x: screen.width * window.devicePixelRatio,
        y: screen.height * window.devicePixelRatio,
      },
    },
  }
}
