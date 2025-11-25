<script setup>
import { ref, computed } from 'vue'
import { useMouseInElement } from '@vueuse/core'

const target = ref(null)
const { elementX, elementY, isOutside, elementWidth, elementHeight } = useMouseInElement(target)

const cardTransform = computed(() => {
  if (isOutside.value) return ''
  
  const MAX_ROTATION = 15
  const rX = (MAX_ROTATION / 2 - (elementY.value / elementHeight.value) * MAX_ROTATION).toFixed(2)
  const rY = ((elementX.value / elementWidth.value) * MAX_ROTATION - MAX_ROTATION / 2).toFixed(2)
  
  return `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg)`
})
</script>

<template>
  <div 
    ref="target"
    class="tilt-card"
    :style="{ transform: cardTransform }"
  >
    <slot />
  </div>
</template>

<style scoped>
.tilt-card {
  transition: transform 0.1s ease-out;
  background: #fff;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid #eee;
  cursor: pointer;
}

/* Dark mode support if you add it later */
@media (prefers-color-scheme: dark) {
  .tilt-card {
    background: #1e1e1e;
    border-color: #333;
    color: #fff;
  }
}
</style>