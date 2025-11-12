<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import DialogItem from './dialogItem.vue'
import { useWindowSize } from '@vueuse/core'

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
  imgUrl: string
  cutPercent?: string
  styles: string[]
  trackIds: string[]
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

const isTrackLoaded = ref(false)

const width = ref(window.innerWidth)
const height = ref(window.innerHeight)
const ratio = computed(() => width.value / height.value)

const backgroundImage = `url(${props.imgUrl})`
const modalId = `ArtisteItem/${props.name}`
let dialog: HTMLDialogElement

function focus(): void {
  if (dialog) {
    dialog.showModal()
    onResize()
  }
}

function openPage(url?: string): void {
  if (url) {
    window.open(url, '_blank')?.focus()
  }
}

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

async function afterLoaded(): Promise<void> {
  for (const trackId of props.trackIds) {
    const track = document.getElementById(trackId)

    if (!track) {
      await new Promise((f) => setTimeout(f, 100))
      return afterLoaded()
    }

    ;(track as HTMLIFrameElement).onload = () => {
      setTrackAsLoaded(trackId)
    }
  }
}

function onResize(): void {
  width.value = dialog.clientWidth
  height.value = dialog.clientHeight
}

onMounted(() => {
  dialog = document.getElementById(modalId) as HTMLDialogElement

  window.addEventListener('resize', onResize)
  onResize()
})
</script>

<template>
  <div
    id="artistContainer"
    :class="classes"
    @mouseenter="$emit('focusImage', { id: imgUrl, isClicked: dialog.open })"
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
    <div
      id="dialogContent"
      class="h-100 w-100 flex flex-column"
      :style="{
        overflowY: ratio < 1 ? `hidden` : `auto`,
      }"
    >
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
      <div
        id="detailsContainer"
        class="w-100"
        :style="{
          height: ratio < 1 ? `calc(100% - 17rem)` : `unset`,
        }"
      >
        <div id="artistImageBackground" class="h-100 w-100"></div>
        <div
          id="detailsContent"
          class="w-100 flex flex-column"
          :style="{
            overflowY: ratio < 1 ? `auto` : `hidden`,
            height: ratio < 1 ? `100%` : `unset`,
          }"
        >
          <div id="trackContainer" class="w-100">
            <h3>Mix</h3>
            <div v-show="isTrackLoaded" id="trackContent" class="w-100 flex flex-column">
              <SoundCloudSong
                v-for="id in props.trackIds"
                :key="id"
                :id="id"
                classes="trackItem"
              ></SoundCloudSong>
            </div>
            <div
              id="loading"
              class="w-100 flex flex-center flex-align-center"
              v-show="!isTrackLoaded"
            ></div>
          </div>
          <div id="descriptionContainer" class="w-100">
            <h3>Description</h3>
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
  transition: background-color, ease-in-out, 0.3s;

  position: relative;
  background-image: v-bind(backgroundImage);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 5px;

  filter: grayscale(1);
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
  #dialogContent {
    background-color: #181818;
    justify-items: center;
    position: relative;
    padding: 0rem;

    &::-webkit-scrollbar {
      width: 0.5rem; /* width of the entire scrollbar */
    }

    &::-webkit-scrollbar-track {
      background: transparent; /* color of the tracking area */
    }

    &::-webkit-scrollbar-thumb {
      background-color: white; /* color of the scroll thumb */
      border-radius: 5px; /* roundness of the scroll thumb */
      border: transparent; /* creates padding around scroll thumb */
    }

    #infosContainer {
      z-index: 1;
      border-bottom: 0.125rem $color solid;

      #infosContent {
        padding: 2rem;

        h2 {
          margin: 0px;
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
              color: rgba(255, 255, 255, 1);
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

    #detailsContainer {
      position: relative;
      background-color: rgba(0, 0, 0, 0.3);

      h3,
      p,
      span {
        color: $color;
      }

      #artistImageBackground {
        position: absolute;
        background-image: v-bind(backgroundImage);
        background-size: 110%;
        background-position: center;
        background-repeat: no-repeat;
      }

      #detailsContent {
        position: relative;
        z-index: 1;

        &::-webkit-scrollbar {
          width: 0.5rem; /* width of the entire scrollbar */
        }

        &::-webkit-scrollbar-track {
          background: transparent; /* color of the tracking area */
        }

        &::-webkit-scrollbar-thumb {
          background-color: white; /* color of the scroll thumb */
          border-radius: 5px; /* roundness of the scroll thumb */
          border: transparent; /* creates padding around scroll thumb */
        }

        #trackContainer,
        #descriptionContainer {
          padding: 2rem;
        }
        #trackContainer {
          #trackContent {
            .trackItem {
              margin-bottom: 0.5rem;
              margin-top: 0.5rem;
            }
          }
        }

        #loading {
          background-image: url('@/assets/img/loading.gif');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 15%;
          height: 9rem;
          max-height: 9rem;
          aspect-ratio: 1;
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
