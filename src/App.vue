<script setup>
import { ref } from 'vue';
import { profile, papers, interests, experience } from './data.js';
import TiltCard from './components/TiltCard.vue';
import profileImg from './assets/profile.jpg';
import NeuroSwitch from './components/NeuroSwitch.vue';


const currentSection = ref('home');

const scrollTo = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
};

const isSpiking = ref(false);

const handleThemeToggle = (state) => {
  // 1. Set the theme on the HTML body
  document.documentElement.setAttribute('data-theme', state);
  
  // 2. Trigger the "Spike" animation if turning ON Action Potential
  if (state === 'active') {
    isSpiking.value = true;
    setTimeout(() => {
      isSpiking.value = false;
    }, 400); // Duration of the flash
  }
};
</script>

<template>
  <div class="container">
    <div class="spike-flash" :class="{ 'firing': isSpiking }"></div>

    <nav class="navbar">
      <div class="logo">🧠 {{ profile.name }}</div>
      <div class="links">
        <a @click.prevent="scrollTo('papers')" href="#">Papers</a>
        <a @click.prevent="scrollTo('resume')" href="#">Resume</a>
        <a @click.prevent="scrollTo('interests')" href="#">Interests</a>
        <a @click.prevent="scrollTo('contact')" href="#">Contact</a> 
        <NeuroSwitch @toggle="handleThemeToggle" />
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
          <a :href="paper.link" class="read-more">Read Paper</a>
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
            <p>{{ job.desc }}</p>
          </div>
        </div>
      </div>

      <div class="resume-download">
        <a href="./resume.pdf" download="Dr_Haozhe_Wang_Resume.pdf" class="btn primary-btn">
          📄 Download Full Resume
        </a>
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

    <section id="contact" class="section alt-bg">
      <h2>📬 Get in Touch</h2>
      <div class="contact-container">
        <!-- <p>
          I am currently open to collaborations on <strong>computational neuroscience</strong>, 
          <strong>visual prostheses</strong>, or discussing the <strong>V1 Saliency Hypothesis</strong>.
        </p> -->
        
        <a :href="`mailto:${profile.email}`" class="btn contact-btn">
          ✉️ {{profile.email}}
        </a>
      </div>
    </section>

    <footer>
      <p>© 2025 Built with Vue.js & 🫖</p>
    </footer>
  </div>
</template>

<style>
/* Basic Reset & Fonts */
:root {
  /* Default (Action Potential / Light Mode) */
  --primary: #42b883; /* Vue Green */
  --text: #2c3e50;
  --bg: #f8f9fa;
  --card-bg: #ffffff;
  --nav-bg: rgba(248, 249, 250, 0.9);
}

/* Resting Potential (Dark Mode) */
[data-theme="resting"] {
  --primary: #51aa86; /* Brighter green for contrast against dark */
  --text: #e2e8f0;    /* Light gray text */
  --bg: #0f172a;      /* Deep dark blue (Slate-900) */
  --card-bg: #1e293b; /* Slightly lighter blue for cards */
  --nav-bg: rgba(15, 23, 42, 0.9);
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  background: var(--bg);
  color: var(--text);
  transition: background 0.5s ease, color 0.5s ease; /* Smooth transition */
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Navigation */
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  position: sticky;
  top: 0;
  background: var(--nav-bg); /*rgba(248, 249, 250, 0.9);*/
  backdrop-filter: blur(10px);
  z-index: 100;
  /* align-items: center; */
}
.navbar a { text-decoration: none; color: var(--text); margin-left: 20px; font-weight: bold; cursor: pointer;}
.navbar a:hover { color: var(--primary); }

.links {
  display: flex;
  align-items: center;
}

/* Hero */
.hero { text-align: center; padding: 100px 0; }
.hero h1 { font-size: 3rem; margin-bottom: 10px; }
.highlight { color: var(--primary); }
.subtitle { font-size: 1.5rem; color: #666; }
.social-row { margin-top: 20px; }
.btn {
  display: inline-block;
  background: var(--text);
  /* color: white; */
  color: var(--bg);
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
/* .read-more { display: block; margin-top: 15px; color: var(--primary); text-decoration: none; font-weight: bold; } */
.emoji { font-size: 3rem; margin-bottom: 10px; }
.hobby-card { text-align: center; background: var(--card-bg);}

/* read-more link style */
.read-more {
  display: inline-flex;
  align-items: center;
  margin-top: 20px;
  padding: 8px 16px;
  background-color: rgba(66, 184, 131, 0.1); /* Transparent Green */
  color: var(--primary);
  text-decoration: none;
  font-weight: bold;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.read-more:hover {
  background-color: var(--primary);
  color: white; /* Invert colors on hover */
  transform: translateY(-2px);
}

/* The Arrow Animation */
.read-more::after {
  content: '→';
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.read-more:hover::after {
  transform: translateX(4px); /* Slide arrow to the right */
}

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
  transform: scale(1.2) rotate(-5deg); /* Zooms and tilts slightly */
  box-shadow: 0 15px 30px rgba(66, 184, 131, 0.4); /* glowing green shadow */
}

/* Resume Download Button Styling */
.resume-download {
  text-align: center;
  margin-top: 50px;
}

.primary-btn {
  background-color: var(--card-bg); /* Uses your green theme */
  color: var(--text);
  padding: 15px 30px;
  border-radius: 50px;
  font-weight: bold;
  text-decoration: none;
  /* box-shadow: 0 5px 15px rgba(66, 184, 131, 0.4); */
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px; /* Space between icon and text */
}

.primary-btn:hover {
  transform: translateY(-3px); /* Moves up slightly */
  box-shadow: 0 8px 20px rgba(66, 184, 131, 0.6);
}

.primary-btn:active {
  transform: translateY(0); /* Click effect */
}

/* Contact Section Styling */
.contact-container {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.contact-container p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #555;
}

.contact-btn {
  background-color: var(--card-bg); /* Dark button for contrast */
  color: var(--text);
  padding: 15px 40px;
  font-size: 1.1rem;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.2s, background-color 0.2s;
  display: inline-block;
}

.contact-btn:hover {
  transform: translateY(-3px); /* Moves up slightly */
  box-shadow: 0 8px 20px rgba(66, 184, 131, 0.6);
}

/* Spike Flash Animation */
.spike-flash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  pointer-events: none; /* Let clicks pass through */
  opacity: 0;
  z-index: 9999;
  transition: opacity 0.1s;
}

.spike-flash.firing {
  animation: spike-pulse 0.4s ease-out;
}

@keyframes spike-pulse {
  0% { opacity: 0; }
  10% { opacity: 0.6; background-color: #fff; } /* The Peak */
  100% { opacity: 0; }
}

</style>