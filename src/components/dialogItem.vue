<script setup lang="ts">
import { onMounted } from 'vue'

/** Define props */
export type Props = {
  id: string
}

const { id } = defineProps<Props>()
let dialog: HTMLDialogElement

onMounted(() => {
  dialog = document.getElementById(id) as HTMLDialogElement
  window.addEventListener('click', () => {
    dialog.close()
  })

  dialog.addEventListener('shown', () => {})
})
</script>

<template>
  <dialog :id="id" @click.stop.prevent="">
    <slot></slot>
  </dialog>
</template>

<style lang="scss">
@import '../../node_modules/bootstrap-icons/font/bootstrap-icons.min.css';

dialog {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;

  padding: 0%;
  z-index: 100;
  height: 80%;
  width: 80%;
  max-width: 800px;
  min-width: 400px;

  border: none;
  border-radius: 5px;
}

dialog[open] {
  animation: showed 0.2s ease-in forwards;
}

dialog:not([open]) {
  animation: closed 0.2s ease-in forwards;
}

@keyframes showed {
  0% {
    top: 100%;
  }
  100% {
    top: 50%;
  }
}
</style>
