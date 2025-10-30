import * as THREE from 'three'

export const randomLetters = 'QWERTYUIOPASDFGHJKLZXCVBNM?/:!-+#'.split('')

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function rgb(r: number, g: number, b: number) {
  return new THREE.Vector3(r, g, b)
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return {
    r: parseInt(result?.[1] ?? 'F', 16),
    g: parseInt(result?.[2] ?? 'F', 16),
    b: parseInt(result?.[3] ?? 'F', 16),
  }
}

export function generateRandomColor(
  mix: THREE.Color = new THREE.Color(255, 255, 255),
): THREE.Color {
  let red = Math.random() * 180
  let green = Math.random() * 180
  let blue = Math.random() * 180

  // mix the color
  if (mix != null) {
    red = (red + mix.r) / 2
    green = (green + mix.r) / 2
    blue = (blue + mix.b) / 2
  }

  return new THREE.Color(red, green, blue)
}
