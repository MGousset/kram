<script setup lang="ts">
/** Define props */
import { ref } from 'vue'
import type { artistesProps } from '../artistItem.vue'
import ArtisteListButton from './artisteListButton.vue'
import artistSlide from './artistSlide.vue'
import carouselBgImg from './carouselBgImg.vue'

export type carouselProps = {
  artistes: artistesProps[] // list of all artists
  classes?: string  // added class
}

const props = defineProps<carouselProps>()  // define props

const selected = ref(0) // actual selected artist slide (index)

const direction = ref('right');

function select(index: number){
  if(index < 0){
    selected.value = props.artistes.length - 1
    direction.value = 'right'
  }
  else if (index >= props.artistes.length){
    selected.value = 0;
    direction.value = 'left'
  }
  else {
    if(index > selected.value){
      direction.value = 'right'
    }
    else if(index < selected.value){
      direction.value = 'left'
    }
    selected.value = index
  }
}
</script>

<template>
  <div id="OverPhotoCarousel">
    <carouselBgImg
      v-for="(artiste, index) in artistes"
        :key="index"
        :imgUrl="artiste.imgUrl"
        :cutPercent="artiste.cutPercent"
        :index="index"
        :selected="selected"
        :direction="direction"
        class="bgImg"
    />
    <div id="listArtist">
      <ArtisteListButton
        id="topButton"
        v-for="(artiste, index) in artistes"
        :key="index"
        :name="artiste.name"
        :index="index"
        @select="select"
        />
    </div>
    <div id="ActualCarousel">
      <ArtisteListButton
        class="sideButton btLeft"
        :name="'prev'"
        :index="selected-1"
        @select="select"
        />
        <artistSlide
          id="artistsContainer"
          v-for="(artiste, index) in artistes"
          :key="index"
          :index="index"
          :selected="selected"
          :direction="direction"
          >
          <p> {{artiste.name}} </p>
        </artistSlide>
      <ArtisteListButton
        class="sideButton btRight"
        :name="'next'"
        :index="selected+1"
        @select="select"
        />
    </div>
  </div>
</template>

<style lang="scss">
#OverPhotoCarousel {
  //background-color: aqua;
  //opacity: 0.5;
  padding: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
  position: relative;

  .bgImg{
    position: absolute;
    //opacity: 0.5;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  #listArtist{
    position: relative;
    display: flex;
    justify-content: center;
    z-index: 2;

    #topButton{
      background-color: rgb(80, 80, 95);
      opacity: 0.7;
      margin: 20px;
      width : 100px;
      height: 40px;
      border : 0px;
      border-radius: 5px;
    }
  }
  #ActualCarousel {
    //background-color: pink;
    //opacity: 0.5;
    position: relative;
    margin : 0;
    width : 100%;
    height: 100%;
    display: flex;
    justify-content: left;
    flex-direction: row;
    z-index: 2;

    #artistsContainer{
      background-color: rgb(80, 80, 95);
      position: absolute;
      left: 15%;
      opacity: 0.7;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 20px;
      padding-right: 20px;
      width: 70%;
      height: 500px;
      border-radius: 20px;
      //z-index: 1;
    }

    .sideButton {
      position: absolute;
      //background-color: rgb(80, 80, 95);
      //opacity: 0.7;
      margin: 0;
      margin-top: 175px;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 20px;
      padding-right: 20px;
      height: 150px;
      //width: 8%;
      width: 80px;
      //border-radius: 20px;
      border : 0;
    }
    .btLeft {
      //left: 5%;
      background: linear-gradient(to right, rgba(80, 80, 95, 1), rgba(80, 80, 95, 0.4));
    }

    .btRight {
      right: 0px;
      background: linear-gradient(to left, rgba(80, 80, 95, 1), rgba(80, 80, 95, 0.4));
    }
  }
}
</style>
