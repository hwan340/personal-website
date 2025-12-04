<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['toggle']);
const isActive = ref(true); // True = Action Potential (Light), False = Resting (Dark)

const toggleState = () => {
  isActive.value = !isActive.value;
  emit('toggle', isActive.value ? 'active' : 'resting');
  
  // Trigger the "Spike" sound or visual (Optional: add audio here if you want!)
};
</script>

<template>
  <button 
    class="neuro-switch" 
    :class="{ 'active-state': isActive }" 
    @click="toggleState"
    aria-label="Toggle Neural State"
  >
    <div class="track">
      <div class="labels">
        <span class="label-resting">Resting</span>
        <span class="label-active">Action</span>
      </div>
      <div class="soma"></div> </div>
  </button>
</template>

<style scoped>
.neuro-switch {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 20px;
}

.track {
  width: 100px;
  height: 34px;
  background-color: #1e293b; /* Dark background for track */
  border-radius: 34px;
  position: relative;
  border: 2px solid var(--primary);
  transition: background-color 0.3s;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  overflow: hidden;
}

/* Text Labels inside the track */
.labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let clicks pass through to the button */
  z-index: 1;
}

.labels span {
  position: absolute;
  top: 50%;
  transform: translateY(-50%); /* Vertically center exactly */
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  transition: opacity 0.3s, color 0.3s;
}

.label-active {
  left: 10px; /* Fixed spacing from the left wall */
  opacity: 0;
  color: #065f46; /* Dark Green text */
}

.label-resting {
  right: 10px; /* Fixed spacing from the right wall */
  opacity: 1;
  color: #94a3b8; /* Light Grey text */
}

/* The sliding knob (Soma) */
.soma {
  width: 26px;
  height: 26px;
  background-color: #94a3b8;
  border-radius: 50%;
  position: absolute;
  top: 2px; /* Center vertically (34px height - 26px circle) / 2 = 4px, minus border... 2px looks right */
  left: 2px;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

/* Active State Styles */
.active-state .track {
  background-color: #d1fae5; /* Light Green tint */
}

.active-state .soma {
  transform: translateX(63px);
  background-color: var(--primary);
  box-shadow: 0 0 15px var(--primary); /* Glowing effect */
}

.active-state .label-resting { opacity: 0; }
.active-state .label-active { opacity: 1; color: var(--primary); }
</style>