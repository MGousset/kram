<script setup lang="ts">
import { onMounted } from 'vue'

/** Define props */
export type Props = {
  id: string
}

const { id } = defineProps<Props>()

const emits = defineEmits<{
  close: []
}>()

let dialog: HTMLDialogElement

onMounted(() => {
  dialog = document.getElementById(id) as HTMLDialogElement
  window.addEventListener('click', () => {
    closeDialog()
  })
})

function closeDialog() {
  emits('close')
  dialog.close()
}
</script>

<template>
  <dialog :id="id" @click.stop.prevent="">
    <button type="button" class="btn" id="closeButton" @click="closeDialog">
      <i class="fa fa-times" aria-hidden="true"></i>
    </button>
    <slot></slot>
  </dialog>
</template>

<style lang="scss">
@import '../assets/main.scss';

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
  min-width: 350px;

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
      font-size: 1.5rem;
      color: $color;
    }

    transition: rotate, ease-in-out, 0.3s;
    &:hover {
      transform: rotate(-180deg);
    }
  }

  &:-internal-dialog-in-top-layer::backdrop {
    z-index: 110;
    width: 110vw;
    height: 110vh;
    transform: translate(-5vw, -5vh);
    pointer-events: none;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.8);
    inset: 0px;
  }
}
</style>
