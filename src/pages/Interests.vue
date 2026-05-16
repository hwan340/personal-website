<script setup>
import { interests } from '../data.js'
</script>

<template>
  <div class="interests-page container">
    <h1>Personal Interests</h1>
    <div class="grid">
      <div
        v-for="hobby in interests"
        :key="hobby.name"
        class="tile"
        :class="hobby.image ? 'tile--image' : 'tile--icon'"
      >
        <img v-if="hobby.image" :src="hobby.image" :alt="hobby.name" class="tile-image" />
        <div v-else class="icon">{{ hobby.emoji }}</div>
        <h3>{{ hobby.name }}</h3>
        <!-- <p>Enjoys {{ hobby.name.toLowerCase() }}.</p> -->
      </div>
    </div>

    <a class="back" href="#/">Back</a>
  </div>
</template>

<style scoped>
.container{max-width:1000px;margin:40px auto;padding:0 20px}
h1{text-align:center;margin-bottom:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;align-items:start}
.tile{background:var(--card-bg);border-radius:12px;padding:14px;box-shadow:0 10px 30px var(--shadow);text-align:center}
.tile--image{grid-column:span 2;padding:16px}
.tile--image .tile-image{width:100%;height:auto;display:block;object-fit:contain;border-radius:10px;margin-bottom:12px}
.tile--image h3{font-size:1.15rem}
.tile--icon{padding:12px}
.tile--icon .icon{height:120px;display:flex;align-items:center;justify-content:center;font-size:44px;margin-bottom:8px;border-radius:8px;background:rgba(0,0,0,0.03)}
.tile h3{margin:6px 0;font-size:1.05rem}
.tile p{color:var(--muted);font-size:0.95rem}
.back{display:block;text-align:center;margin-top:20px;text-decoration:none;color:#fff;background:var(--primary);padding:10px 18px;border-radius:999px;width:120px;margin-left:auto;margin-right:auto}
@media(max-width:480px){.container{margin:18px auto}}

@media(max-width:700px){
  .tile--image{grid-column:span 1}
}
</style>
