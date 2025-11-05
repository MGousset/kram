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
    closeDialog()
  })
})

function closeDialog() {
  dialog.close()
}
</script>

<template>
  <dialog :id="id" @click.stop.prevent="">
    <btn type="btn" class="btn" id="closeButton" @click="closeDialog"
      ><i i class="bi bi-x"></i
    ></btn>
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

  #closeButton {
    z-index: 102;
    position: absolute;
    top: 0px;
    right: 0px;
    margin: 0.25rem;
    padding: 0.5rem;

    i::before {
      font-size: 2rem;
      color: white;
      background-color: black;
    }

    transition: rotate, ease-in-out, 0.3s;
    &:hover {
      transform: rotate(-180deg);
    }
  }
}

dialog[open] {
  animation: showed 0.1s ease-in forwards;
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
