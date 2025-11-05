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
  <div id="artistContainer" :class="classes" @click.stop.prevent="focus">
    <div id="seeMoreButton" class="flex flex-center"><h4>Voir plus</h4></div>
    <div class="w-100 flex flex-column infosContainer">
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
      <div class="infosContainer">
        <div id="artistImageBackground" class="w-100 h-100"></div>
        <div id="infosContent" class="h-100 w-100 flex flex-column flex-between">
          <h2>
            {{ name }}
          </h2>
          <div class="w-100 flex flex-between flex-align-end">
            <div id="stylesContainer" class="w-100 flex flex-row flex-start">
              <span v-for="style in props.styles" :key="style" class="styleContainer">{{
                style
              }}</span>
            </div>
            <div id="bookButton" class="flex flex-center flex-align-center"><h4>Book</h4></div>
          </div>
        </div>
      </div>
      <div id="detailsContainer" class="w-100 flex flex-column flex-around">
        <div id="trackContainer" class="w-100">
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
          <div id="descriptionContent" class="flex flex-column flex-center">
            <p v-for="line in props.description" :key="line">{{ line }}</p>
          </div>
        </div>
      </div>
    </div>
  </DialogItem>
</template>

<style lang="scss">
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
        color: black !important;
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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-color: rgba(255, 255, 255, 1);
    &:hover {
      background-color: rgba(255, 255, 255, 0.8);
    }

    h4 {
      transition: transparent, ease-in-out, 0.1s;
      margin: 0px;
      color: transparent !important;
    }
  }
}

.infosContainer {
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0);

  .styleContainer {
    background-color: rgba(0, 0, 0, 1);
    margin-right: 0.5rem;
    padding: 0.5rem;
    border-radius: 50px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.6);
    }
  }
}

#dialogContainer {
  #artistImageBackground {
    z-index: -1;
    position: absolute;
    background-image: v-bind(backgroundImage);
    filter: blur(0px);
    background-size: 110%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .infosContainer {
    height: fit-content;
    min-height: 13rem;
    justify-items: center;
    position: relative;
    padding: 0rem;

    #infosContent {
      padding: 2rem;
    }
  }

  #bookButton {
    cursor: pointer;
    visibility: visible;
    width: 150px;
    height: fit-content;
    padding: 0.75rem;

    background-color: rgba(255, 255, 255, 1);
    &:hover {
      background-color: rgba(255, 255, 255, 0.8);
    }

    h4 {
      margin: 0px;
      color: black !important;
    }
  }

  #detailsContainer {
    height: calc(100% - 128px - 2rem);
    margin-top: 2rem;
    padding: 2rem;

    #trackContainer,
    #descriptionContainer {
      border-radius: 5px;
      overflow-y: auto;
      margin-bottom: 2rem;
      max-height: 50%;
      height: fit-content;
      background-color: rgba(0, 0, 0, 0.5);
    }
    #trackContainer {
      #trackContent {
        padding: 1rem 2rem 1rem 2rem;

        .trackItem {
          margin-bottom: 1rem;
          margin-top: 1rem;
        }
      }
    }

    #descriptionContainer {
      padding: 2rem;

      #descriptionContent {
        overflow-y: auto;
      }
    }
  }
}

dialog:-internal-dialog-in-top-layer::backdrop {
  background-image: v-bind(backgroundImage);
  background-size: 33%;
  filter: blur(20px) grayscale(0.2);
}
</style>
