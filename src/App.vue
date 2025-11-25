<script setup>
import { ref } from 'vue';
import { profile, papers, interests, experience } from './data.js';
import TiltCard from './components/TiltCard.vue';
import profileImg from './assets/profile.jpg';

const currentSection = ref('home');

const scrollTo = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};
</script>

<template>
  <div class="container">
    <nav class="navbar">
      <div class="logo">🧠 {{ profile.name }}</div>
      <div class="links">
        <a @click.prevent="scrollTo('papers')" href="#">Papers</a>
        <a @click.prevent="scrollTo('resume')" href="#">Resume</a>
        <a @click.prevent="scrollTo('interests')" href="#">Interests</a>
      </div>
    </nav>

    <header class="hero">
      <div class="profile-container">
        <img :src="profileImg" alt="Profile Picture" class="profile-pic" />
      </div>
      <h1>Hello, I'm <span class="highlight">{{ profile.name }}</span></h1>
      <p class="subtitle">{{ profile.bio }}</p>
      <div class="social-row">
        <a v-for="social in profile.socials" :key="social.name" :href="social.url" target="_blank" class="btn">
          {{ social.icon }} {{ social.name }}
        </a>
      </div>
    </header>

    <section id="papers" class="section">
      <h2>📜 Published Research</h2>
      <div class="grid">
        <TiltCard v-for="paper in papers" :key="paper.id">
          <h3>{{ paper.title }}</h3>
          <p class="journal">{{ paper.journal }} ({{ paper.year }})</p>
          <p class="summary">{{ paper.summary }}</p>
          <a :href="paper.link" class="read-more">Read Paper →</a>
        </TiltCard>
      </div>
    </section>

    <section id="resume" class="section alt-bg">
      <h2>💼 Experience</h2>
      <div class="timeline">
        <div v-for="(job, index) in experience" :key="index" class="timeline-item">
          <div class="year">{{ job.year }}</div>
          <div class="details">
            <h3>{{ job.role }}</h3>
            <p>{{ job.company }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="interests" class="section">
      <h2>🧩 Personal Interests</h2>
      <div class="grid">
        <TiltCard v-for="hobby in interests" :key="hobby.name" class="hobby-card">
          <div class="emoji">{{ hobby.emoji }}</div>
          <h3>{{ hobby.name }}</h3>
          <p>{{ hobby.desc }}</p>
        </TiltCard>
      </div>
    </section>

    <footer>
      <p>© 2025 Built with Vue.js & ☕</p>
    </footer>
  </div>
</template>

<style>
/* Basic Reset & Fonts */
:root {
  --primary: #42b883; /* Vue Green */
  --text: #2c3e50;
  --bg: #f8f9fa;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  background: var(--bg);
  color: var(--text);
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Navigation */
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  position: sticky;
  top: 0;
  background: rgba(248, 249, 250, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
}
.navbar a { text-decoration: none; color: var(--text); margin-left: 20px; font-weight: bold; cursor: pointer;}
.navbar a:hover { color: var(--primary); }

/* Hero */
.hero { text-align: center; padding: 100px 0; }
.hero h1 { font-size: 3rem; margin-bottom: 10px; }
.highlight { color: var(--primary); }
.subtitle { font-size: 1.5rem; color: #666; }
.social-row { margin-top: 20px; }
.btn {
  display: inline-block;
  background: var(--text);
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  text-decoration: none;
  margin: 0 10px;
  transition: transform 0.2s;
}
.btn:hover { transform: scale(1.05); background: var(--primary); }

/* Sections */
.section { padding: 80px 0; }
.section h2 { font-size: 2.5rem; margin-bottom: 40px; text-align: center; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }

/* Specific Card Styles */
.journal { color: #888; font-style: italic; }
.read-more { display: block; margin-top: 15px; color: var(--primary); text-decoration: none; font-weight: bold; }
.emoji { font-size: 3rem; margin-bottom: 10px; }
.hobby-card { text-align: center; }

/* Timeline (Simple) */
.timeline-item { display: flex; margin-bottom: 20px; border-left: 2px solid var(--primary); padding-left: 20px; }
.year { font-weight: bold; width: 100px; color: var(--primary); }

footer { text-align: center; padding: 40px; color: #888; }

/* Profile Picture Styling */
.profile-container {
  margin-bottom: 20px;
}

.profile-pic {
  width: 150px;      /* Adjust size as needed */
  height: 150px;
  border-radius: 50%; /* Makes it a perfect circle */
  object-fit: cover; /* Ensures the image doesn't stretch weirdly */
  border: 4px solid var(--primary); /* Green border matching your theme */
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Fun Hover Effect */
.profile-pic:hover {
  transform: scale(1.1) rotate(5deg); /* Zooms and tilts slightly */
  box-shadow: 0 15px 30px rgba(66, 184, 131, 0.4); /* glowing green shadow */
}
</style>