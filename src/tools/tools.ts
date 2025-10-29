import * as THREE from 'three'

export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function rgb(r: number, g: number, b: number) {
  return new THREE.Vector3(r, g, b)
}
