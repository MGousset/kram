<script setup lang="ts">
/** Define props */
export type artistesProps = {
  id: string
}

const { id } = defineProps<artistesProps>()
const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%${id}&color=%23000000&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`
</script>

<template>
  <iframe
    width="100%"
    height="450"
    scrolling="no"
    frameborder="no"
    allow="autoplay"
    :src="src"
  ></iframe>
  <div
    style="
      font-size: 10px;
      color: #cccccc;
      line-break: anywhere;
      word-break: normal;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family:
        Interstate,
        Lucida Grande,
        Lucida Sans Unicode,
        Lucida Sans,
        Garuda,
        Verdana,
        Tahoma,
        sans-serif;
      font-weight: 100;
    "
  >
    <a
      href="https://soundcloud.com/mira303"
      title="Mira3Ø3"
      target="_blank"
      style="color: #cccccc; text-decoration: none"
      >Mira3Ø3</a
    >
    ·
    <a
      href="https://soundcloud.com/mira303/sets/mix"
      title="Sets"
      target="_blank"
      style="color: #cccccc; text-decoration: none"
      >Sets</a
    >
  </div>
</template>
