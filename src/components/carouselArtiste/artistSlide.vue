<script setup lang="ts">
import { computed } from 'vue';


export type artisteSlideProps = {
  index: number
  selected : number
  direction : string
  classes?: string
}

const transi = computed(() => 'slide-' + props.direction)

const props = defineProps<artisteSlideProps>()

const visible = computed(() => props.index === props.selected) // actual selected artist slide (index)


</script>

<template>
  <transition :name="transi">
    <div v-show="visible">
      <p>{{ index }}</p>
      <p>{{ visible }}</p>
      <slot />
    </div>
  </transition>
</template>

<style lang="scss">
  .slide-right-enter-active{
    animation: slideRightIn .5s;
  }

  .slide-right-leave-active{
    animation: slideRightOut .5s;
    position: absolute;
    left: 20%;
  }

  @keyframes slideRightIn {
    from { transform: translateX(135%); }
    to { transform: translateX(0); }
  }

  @keyframes slideRightOut {
    from { transform: translateX(0); }
    to { transform: translateX(-135%); }
  }


  .slide-left-enter-active{
    animation: slideLeftIn .5s;
  }

  .slide-left-leave-active{
    animation: slideLeftOut .5s;
    position: absolute;
    left: 20%;
  }

  @keyframes slideLeftIn {
    from { transform: translateX(-135%); }
    to { transform: translateX(0); }
  }

  @keyframes slideLeftOut {
    from { transform: translateX(0); }
    to { transform: translateX(135%); }
  }
</style>
