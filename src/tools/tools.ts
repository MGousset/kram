import * as THREE from 'three'

export const enum ANIMATION {
  random = 'random',
  randomstep = 'randomstep',
  grow = 'grow',
}

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
  let red = Math.random() * 255
  let green = Math.random() * 255
  let blue = Math.random() * 255

  // mix the color
  if (mix != null) {
    red = (red + mix.r) / 2
    green = (green + mix.r) / 2
    blue = (blue + mix.b) / 2
  }

  const newColor = new THREE.Color(red, green, blue)
  console.log(newColor)
  return newColor
}

export function growElementText(element: HTMLElement, multiplier: number): string {
  const currentFont = element.style.fontSize
  const currentSize = Number(currentFont.slice(0, -2))
  const unity = currentFont.slice(-2)
  if (isNaN(currentSize) || !unity) {
    return ''
  }
  element.style.fontSize = multiplier * currentSize + unity
  return currentFont
}
