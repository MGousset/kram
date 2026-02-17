<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import DialogItem from './dialogItem.vue'
import { useWindowSize } from '@vueuse/core'
import { detectMobile } from '@/tools/tools'

const SoundCloudSong = defineAsyncComponent(() =>
  import('./soundCloudSong.vue').then((comp) => {
    afterLoaded()
    return comp
  }),
)

/** Define props */
export type artistesProps = {
  name: string
  description: string[]
  imgUrls: string[]
  cutPercent?: string
  styles: string[]
  trackIds: string[]
  prodIds: string[]
  imageCenter: number
  network?: { insta?: string; soundCloud?: string }
  classes?: string
}

const props = defineProps<artistesProps>()

/** Define Events */

const emits = defineEmits({
  focusImage: ({ id, isClicked }) => {
    return !isClicked
  },
})

const isTrackLoaded = ref(!props.trackIds.length)
const isProdLoaded = ref(!props.prodIds.length)

const backgroundImages = props.imgUrls.map((img) => `url(${img})`)
const backgroundImage = backgroundImages[0]
const modalId = `ArtisteItem/${props.name}`
let dialog: HTMLDialogElement

function focus(): void {
  if (dialog) {
    dialog.showModal()
  }
}

function openPage(url?: string): void {
  if (url) {
    window.open(url, '_blank')?.focus()
  }
}

onMounted(() => {
  dialog = document.getElementById(modalId) as HTMLDialogElement
})

const isTrackLoadedById = new Map<string, boolean>()
for (const trackId of props.trackIds) {
  isTrackLoadedById.set(trackId, false)
}

function setTrackAsLoaded(id: string) {
  isTrackLoadedById.set(id, true)

  for (const trackId of props.trackIds) {
    if (!isTrackLoadedById.get(trackId)) {
      return
    }
  }

  isTrackLoaded.value = true
}

const isProdLoadedById = new Map<string, boolean>()
for (const trackId of props.trackIds) {
  isTrackLoadedById.set(trackId, false)
}

function setProdAsLoaded(id: string) {
  isProdLoadedById.set(id, true)

  for (const prodId of props.prodIds) {
    if (!isProdLoadedById.get(prodId)) {
      return
    }
  }

  isProdLoaded.value = true
}

async function setTracksListener(): Promise<void> {
  for (const trackId of props.trackIds) {
    const track = document.getElementById(trackId)

    if (track == null) {
      await new Promise((f) => setTimeout(f, 100))
      setTracksListener()
    }

    ;(track as HTMLIFrameElement).onload = () => {
      setTrackAsLoaded(trackId)
    }
  }
}

async function setProdsListener(): Promise<void> {
  for (const prodId of props.prodIds) {
    const prod = document.getElementById(prodId)

    if (prod == null) {
      await new Promise((f) => setTimeout(f, 100))
      setProdsListener()
    }

    ;(prod as HTMLIFrameElement).onload = () => {
      setProdAsLoaded(prodId)
    }
  }
}

function afterLoaded(): void {
  setTracksListener()
  setProdsListener()
}

const isMobile = detectMobile()
let classes = props.classes
if (isMobile) {
  classes += ' isMobile'
}

const backgroundPosition = `50% ${props.imageCenter}%`
</script>

<template>
  <div
    id="artistContainer"
    :class="classes"
    @mouseenter="$emit('focusImage', { id: imgUrls[0], isClicked: dialog.open })"
    @mouseleave="$emit('focusImage', { isClicked: dialog.open })"
    @click.stop.prevent="focus"
    class="color"
  >
    <div id="seeMoreButton" class="flex flex-center inverse-color"><h4>Show</h4></div>
    <div id="infosContainer" class="w-100 flex flex-column">
      <h2>
        {{ name }}
      </h2>
      <div id="stylesContainer" class="w-100 flex flex-row flex-start">
        <span v-for="style in props.styles" :key="style" class="styleContainer">{{ style }}</span>
      </div>
    </div>
  </div>
  <DialogItem
    :id="modalId"
    class="dialogContainer"
    @close="$emit('focusImage', { isClicked: false })"
  >
    <div id="dialogContent" class="w-100 flex flex-column">
      <div id="infosContainer" class="color">
        <div id="infosContent" class="h-100 w-100 flex flex-column flex-between">
          <div class="w-100 flex flex-column">
            <h2>{{ name }}</h2>
            <div
              id="stylesContainer"
              class="w-100 flex flex-row flex-start flex-align-end flex-wrap"
            >
              <span v-for="style in props.styles" :key="style" class="styleContainer">{{
                style
              }}</span>
            </div>
          </div>
          <div class="flex flex-between flex-align-end">
            <div id="iconsConatiner" class="flex flex-align-end">
              <a
                v-if="network?.insta"
                class="btn"
                :style="{ marginBottom: `-0.25rem` }"
                @click="() => openPage(network?.insta)"
              >
                <i class="fa fa-instagram" aria-hidden="true"></i>
              </a>
              <a
                v-if="network?.soundCloud"
                class="btn"
                target="_blank"
                :style="{ marginBottom: `-0.5rem` }"
                @click="() => openPage(network?.soundCloud)"
              >
                <i class="fa fa-soundcloud" aria-hidden="true"></i>
              </a>
            </div>
            <a
              id="bookButton"
              class="inverse-color flex flex-around flex-align-center"
              target="_blank"
              href="mailto:booking@kram-agency.com"
              @click="() => openPage(`mailto:booking@kram-agency.com`)"
            >
              <i class="fa fa-envelope" aria-hidden="true"></i>
              <h4>Book</h4>
            </a>
          </div>
        </div>
      </div>

      <div id="photosContainer" class="w-100 flex flex-row flex-start">
        <div
          v-for="backgroundImage in backgroundImages"
          :key="backgroundImage"
          class="photoContainer h-100 w-100"
          :style="{ backgroundImage: `${backgroundImage}` }"
        ></div>
      </div>

      <div id="detailsContainer" class="w-100 detailsContainer">
        <div id="detailsContent" class="w-100 flex flex-row flex-wrap flex-center">
          <div
            v-if="props.trackIds.length"
            v-show="isTrackLoaded"
            id="trackContainer"
            class="h-100"
          >
            <h3>Sets</h3>
            <div id="trackContent" class="w-100 flex flex-column">
              <SoundCloudSong
                v-for="id in props.trackIds"
                :key="id"
                :id="id"
                classes="trackItem"
              ></SoundCloudSong>
            </div>
          </div>

          <div v-if="props.prodIds.length" v-show="isProdLoaded" id="trackContainer" class="h-100">
            <h3>Productions</h3>
            <div id="trackContent" class="w-100 flex flex-column">
              <SoundCloudSong
                v-for="id in props.prodIds"
                :key="id"
                :id="id"
                classes="trackItem"
              ></SoundCloudSong>
            </div>
          </div>

          <div id="descriptionContainer" class="h-100">
            <h3>Bio</h3>
            <div id="descriptionContent" class="flex flex-column flex-center">
              <p v-for="line in props.description" :key="line">{{ line }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DialogItem>
</template>

<style lang="scss">
@import '../assets/main.scss';

#artistContainer {
  cursor: pointer;
  transition: grayscale, ease-in-out, 0.3s;

  position: relative;
  background-image: v-bind(backgroundImage);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5px;

  filter: grayscale(0.8);

  &.isMobile {
    filter: grayscale(0.3);
  }

  &:hover {
    filter: grayscale(0);
    background-size: 140%;

    #seeMoreButton {
      transition: visibility, ease-in-out, 0.3s;
      visibility: visible;

      h4 {
        color: $color-inverse !important;
      }
    }
  }

  #seeMoreButton {
    transition: background-color, ease-in-out, 0.2s;
    transition: visibility, ease-in-out, 0s;

    visibility: hidden;
    width: 10rem;
    height: auto;
    padding: 0.75rem;

    position: absolute;
    margin: auto;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;

    background-color: rgba(255, 255, 255, 0.8);
    &:hover {
      background-color: rgba(255, 255, 255, 1);
    }

    h4 {
      transition: transparent, ease-in-out, 0.1s;
      margin: 0px;
      color: transparent !important;
    }
  }
}

#infosContainer {
  padding: 0.5rem;
  h2 {
    @media screen and (max-width: 550px) {
      font-size: 3rem !important;
    }
  }

  .styleContainer {
    transition: background-color ease-in-out 0.1s;

    background-color: rgba(24, 24, 24, 0.7);
    margin: 0.25rem;
    padding: 0.5rem;
    border-radius: 5px;

    font-weight: bold;

    &:hover {
      background-color: rgba(24, 24, 24, 1);
    }
  }
}

.dialogContainer {
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.25rem; /* width of the entire scrollbar */
  }

  &::-webkit-scrollbar-track {
    background-color: #181818; /* color of the tracking area */
  }

  &::-webkit-scrollbar-thumb {
    background-color: white; /* color of the scroll thumb */
    border-radius: 0px 5px 5px 0px; /* roundness of the scroll thumb */
    border: transparent; /* creates padding around scroll thumb */
  }

  #dialogContent {
    background-color: #181818;
    justify-items: center;
    padding: 0rem;

    #infosContainer {
      padding: 0rem;
      height: 14rem;
      border-bottom: 0.125rem $color solid;

      #infosContent {
        padding: 1rem;

        h2 {
          margin: 0px;

          @media screen and (max-width: 550px) {
            font-size: 2rem;
          }
        }

        .styleContainer {
          transition: background-color ease-in-out 0.1s;
          background-color: rgba(255, 255, 255, 0.7);
          color: black !important;
          margin-left: 0rem !important;

          &:hover {
            background-color: rgba(255, 255, 255, 1);
          }
        }

        #iconsConatiner {
          margin-left: 0.125rem;
          a {
            padding: 0px;
            margin-right: 1rem;
            i {
              color: rgba(255, 255, 255, 0.7);
              font-size: 2rem;

              &:hover {
                color: rgba(255, 255, 255, 1);
              }
            }
          }
        }

        #bookButton {
          margin-top: 1rem;
          border-radius: 5px;
          cursor: pointer;
          visibility: visible;
          width: 10rem;
          height: fit-content;
          padding: 0.75rem;
          background-color: rgba(255, 255, 255, 1);
          color: $color-inverse !important;
          align-self: flex-end;

          transition: transform, ease-in-out, 0.1s;
          &:hover {
            box-shadow: 0.25rem 0.25rem 0rem 0rem white;
            transform: translate(-0.25rem, -0.25rem);
          }

          h4 {
            margin: 0px;
          }
        }
      }
    }

    #photosContainer {
      height: 14rem;

      .photoContainer {
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: v-bind(backgroundPosition);
      }
    }

    #detailsContainer {
      border-top: 0.125rem $color solid;

      h3,
      p,
      span {
        color: $color;
      }

      #detailsContent {
        min-height: 300px;
        background-color: rgba(0, 0, 0, 0.4);
        padding: 0.5rem;

        #trackContainer,
        #descriptionContainer {
          padding: 0.5rem;
          flex-grow: 1;
          min-width: 300px;
        }

        .trackItem {
          margin-bottom: 0.5rem;
          margin-top: 0.5rem;
        }

        #descriptionContent {
          max-width: 400px;
        }
      }
    }
  }
}

dialog:-internal-dialog-in-top-layer::backdrop {
  //background-image: v-bind(backgroundImage);
  background-size: 100% 100%;
  filter: blur(5px) grayscale(0.2) contrast(0.8);
}
</style>
