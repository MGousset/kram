<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function decrement() {
  count.value--
}
</script>

<template>
  <div>{{ count }}</div>
  <button type="button" class="btn btn-success" @click="increment">Add</button>
  <button type="button" class="btn btn-success" @click="decrement">Substract</button>
</template>
