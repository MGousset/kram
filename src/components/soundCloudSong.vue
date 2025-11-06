<script setup lang="ts">
import { onMounted } from 'vue'

/** Define props */
export type artistesProps = {
  id: string
  classes?: string
}

const { id, classes } = defineProps<artistesProps>()
const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%${id}&color=%23ff5500&inverse=true&auto_play=false&show_user=true`

let iframe: HTMLIFrameElement
onMounted(() => {
  iframe = document.getElementById(id) as HTMLIFrameElement

  if (!iframe) {
    return
  }

  iframe.loading = 'eager'
  iframe.src = src
})
</script>

<template>
  <iframe
    :id="id"
    width="100%"
    height="20"
    scrolling="no"
    frameborder="no"
    allow="autoplay"
    :class="classes"
  ></iframe>
</template>
