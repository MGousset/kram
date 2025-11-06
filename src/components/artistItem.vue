<script setup lang="ts">
import { onMounted } from 'vue'
import SoundCloudSong from './soundCloudSong.vue'
import DialogItem from './dialogItem.vue'

/** Define props */
export type artistesProps = {
  name: string
  description: string[]
  imgUrl: string
  styles: string[]
  trackIds: string[]
  network?: { insta?: string; soundCloud?: string }
  classes?: string
}

const props = defineProps<artistesProps>()

const backgroundImage = `url(${props.imgUrl})`
const modalId = `ArtisteItem/${props.name}`
let dialog: HTMLDialogElement

function focus(): void {
  if (dialog) {
    dialog.showModal()
  }
}

onMounted(() => {
  dialog = document.getElementById(modalId) as HTMLDialogElement
})
</script>

<template>
  <div id="artistContainer" :class="classes" @click.stop.prevent="focus" class="color">
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
  <DialogItem :id="modalId">
    <div id="dialogContainer" class="w-100 h-100 flex flex-column">
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
                :href="network?.insta"
                target="_blank"
                :style="{ marginBottom: `-0.25rem` }"
              >
                <i class="fa fa-instagram" aria-hidden="true"></i>
              </a>
              <a
                v-if="network?.soundCloud"
                class="btn"
                :href="network?.soundCloud"
                target="_blank"
                :style="{ marginBottom: `-0.5rem` }"
              >
                <i class="fa fa-soundcloud" aria-hidden="true"></i>
              </a>
            </div>
            <div id="bookButton" class="inverse-color flex flex-center flex-align-center">
              <h4>Book</h4>
            </div>
          </div>
        </div>
      </div>
      <div id="detailsContainer" class="w-100">
        <div id="artistImageBackground" class="h-100 w-100"></div>
        <div id="detailsContent" class="h-100 w-100 flex flex-column">
          <div id="trackContainer" class="w-100">
            <h3>Mix</h3>
            <div id="trackContent" class="w-100 flex flex-column">
              <SoundCloudSong
                v-for="id in props.trackIds"
                :key="id"
                :id="id"
                classes="trackItem"
              ></SoundCloudSong>
            </div>
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

  filter: grayscale(0.5);
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
    width: 150px;
    height: auto;
    padding: 0.75rem;

    position: absolute;
    margin: auto;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);

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

#dialogContainer {
  justify-items: center;
  position: relative;
  padding: 0rem;

  #infosContainer {
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

        span {
          color: black !important;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 1);
        }
      }

      #iconsConatiner {
        a {
          padding: 0rem 1rem 0rem 0rem;
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
    height: calc(100% - 17rem);
    position: relative;
    background-color: rgba(0, 0, 0, 0.3);

    h3,
    p,
    span {
      color: $color;
    }

    #artistImageBackground {
      z-index: -1;
      position: absolute;
      background-image: v-bind(backgroundImage);
      background-size: 110%;
      background-position: center;
      background-repeat: no-repeat;
    }

    #detailsContent {
      &::-webkit-scrollbar {
        display: none;
      }

      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;

      overscroll-behavior: contain;
      overflow-y: auto;

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

      #descriptionContainer {
        #descriptionContent {
          overflow-y: auto;
        }
      }
    }
  }
}

dialog:-internal-dialog-in-top-layer::backdrop {
  background-image: v-bind(backgroundImage);
  background-size: 100% 100%;
  filter: blur(10px) grayscale(0.4) contrast(0.7);
}
</style>
