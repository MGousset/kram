<script setup lang="ts">
import { computed } from 'vue';


export type carouselBgImgProps = {
  imgUrl: string
  cutPercent?: string
  index: number
  selected : number
  direction : string
  classes?: string
}

const props = defineProps<carouselBgImgProps>()

const transi = computed(() => 'slideImg-' + props.direction)

const visible = computed(() => props.index === props.selected) // actual selected artist slide (index)
</script>

<template>
  <transition :name="transi">
    <div v-show="visible" :style="{
      backgroundImage : `url(${props.imgUrl})`,
      backgroundPosition: `center ${props.cutPercent ?? 0}%`
      }"/>
  </transition>
</template>

<style lang="scss">
  .slideImg-right-enter-active{
    animation: slideDownIn .5s;
  }

  .slideImg-right-leave-active{
    animation: slideDownOut .5s;
    position: absolute;
  }

  @keyframes slideDownIn {
    from { transform: translateY(135%); }
    to { transform: translateY(0); }
  }

  @keyframes slideDownOut {
    from { transform: translateY(0); }
    to { transform: translateY(-135%); }
  }


  .slideImg-left-enter-active{
    animation: slideUpIn .5s;
  }

  .slideImg-left-leave-active{
    animation: slideUpOut .5s;
    position: absolute;
  }

  @keyframes slideUpIn {
    from { transform: translateY(-135%); }
    to { transform: translateY(0); }
  }

  @keyframes slideUpOut {
    from { transform: translateY(0); }
    to { transform: translateY(135%); }
  }
</style>
