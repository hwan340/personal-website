<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import SunCalc from 'suncalc';
import { profile, papers, interests, experience } from './data.js';
import TiltCard from './components/TiltCard.vue';
import profileImg from './assets/profile.jpg';
import NeuroSwitch from './components/NeuroSwitch.vue';
import Interests from './pages/Interests.vue';

const isNavOpen = ref(false);
const isSpiking = ref(false);
const themeState = ref('active');

const getThemeStateByTime = () => {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7 ? 'resting' : 'active';
};

const getThemeStateBySun = (latitude, longitude, date = new Date()) => {
  const times = SunCalc.getTimes(date, latitude, longitude);

  if (!times.sunrise || !times.sunset) {
    return getThemeStateByTime();
  }

  return date >= times.sunrise && date < times.sunset ? 'active' : 'resting';
};

const getThemeStateFromLocation = (latitude, longitude) => {
  return getThemeStateBySun(latitude, longitude);
};

const getThemeStateFromGeolocation = () => {
  if (!navigator.geolocation) {
    return Promise.resolve(getThemeStateByTime());
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(
          getThemeStateFromLocation(position.coords.latitude, position.coords.longitude)
        );
      },
      () => resolve(getThemeStateByTime()),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60 * 60 * 1000 }
    );
  });
};

const applyTheme = (state, shouldSpike = false) => {
  themeState.value = state;
  document.documentElement.setAttribute('data-theme', state);

  if (shouldSpike && state === 'active') {
    isSpiking.value = true;
    setTimeout(() => {
      isSpiking.value = false;
    }, 400);
  }
};

const credibility = computed(() => [
  { label: 'Role', value: profile.title },
  { label: 'Focus', value: profile.focus },
  { label: 'Papers', value: `${papers.length}+ selected` },
  { label: 'Based in', value: profile.basedIn },
]);

const hasContactMessage = computed(() => profile.contactMessage.trim().length > 0);

// Simple hash-based routing for the Interests page (no vue-router required)
const currentHash = ref(window.location.hash || '');
const handleHashChange = () => (currentHash.value = window.location.hash || '');
const showInterests = computed(() => currentHash.value === '#/interests');

const scrollTo = (id) => {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  isNavOpen.value = false;
};

const handleThemeToggle = (state) => {
  applyTheme(state, true);
};

onMounted(async () => {
  applyTheme(await getThemeStateFromGeolocation());
  window.addEventListener('hashchange', handleHashChange);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', handleHashChange);
});
</script>

<template>
  <div class="container">
    <div class="spike-flash" :class="{ firing: isSpiking }"></div>

    <nav class="navbar">
      <div class="logo">🧠 {{ profile.name }}</div>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="isNavOpen"
        aria-label="Toggle navigation"
        @click="isNavOpen = !isNavOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="links" :data-open="isNavOpen">
        <a @click.prevent="scrollTo('home')" href="#">Home</a>
        <a @click.prevent="scrollTo('papers')" href="#">Publications</a>
        <a @click.prevent="scrollTo('resume')" href="#">Experience</a>
        <a @click.prevent="scrollTo('contact')" href="#">Contact</a>
        <NeuroSwitch :initial-state="themeState" @toggle="handleThemeToggle" />
      </div>
    </nav>
    
    <div v-if="showInterests">
      <Interests />
    </div>

    <div v-else class="container-root">
    <header id="home" class="hero">
      <div class="profile-container">
        <img :src="profileImg" alt="Profile Picture" class="profile-pic" />
      </div>

      <p class="eyebrow">Neural scientist and engineer</p>
      <h1>{{ profile.heroSubtitle }}</h1>
      <p class="subtitle">{{ profile.bio }}</p>

      <div class="social-row">
        <a
          v-for="social in profile.socials"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noreferrer"
          class="btn social-btn"
        >
          {{ social.icon }} <span>{{ social.name }}</span>
        </a>
      </div>

      <div class="credibility-strip">
        <div v-for="item in credibility" :key="item.label" class="credibility-item">
          <span class="credibility-label">{{ item.label }}</span>
          <span class="credibility-value">{{ item.value }}</span>
        </div>
      </div>
    </header>

    <section id="papers" class="section">
      <h2>📜 Selected Publications</h2>
      <div class="grid">
        <TiltCard v-for="paper in papers" :key="paper.id">
          <p class="paper-tag">{{ paper.highlight }}</p>
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

    
    <section id="contact" class="section alt-bg">
      <h2>📬 Get in Touch</h2>
      <div class="contact-container">
        <p v-if="hasContactMessage">{{ profile.contactMessage }}</p>

        <a :href="`mailto:${profile.email}`" class="btn contact-btn">
          ✉️ {{ profile.email }}
        </a>
      </div>
    </section>

    <footer>
      <p>© 2025 Built with Vue.js</p>
    </footer>

    <a href="#/interests" class="more-floating" aria-label="More interests">
      <span class="paw">🐾</span>
      <span class="more-label">More?</span>
    </a>
    </div>
  </div>
</template>

<style>
:root {
  --primary: #2e8b57;
  --primary-strong: #186a43;
  --text: #1f2933;
  --muted: #5b6b7f;
  --bg: #f5f7f4;
  --bg-accent: #e5efe8;
  --card-bg: rgba(255, 255, 255, 0.88);
  --nav-bg: rgba(245, 247, 244, 0.82);
  --border: rgba(31, 41, 51, 0.1);
  --shadow: rgba(15, 23, 42, 0.12);
  --shadow-strong: rgba(15, 23, 42, 0.2);
}

[data-theme="resting"] {
  --primary: #7ad6a3;
  --primary-strong: #4fbe81;
  --text: #e5eef6;
  --muted: #a9b7c7;
  --bg: #0d1420;
  --bg-accent: #142132;
  --card-bg: rgba(18, 27, 40, 0.88);
  --nav-bg: rgba(13, 20, 32, 0.82);
  --border: rgba(229, 238, 246, 0.1);
  --shadow: rgba(0, 0, 0, 0.38);
  --shadow-strong: rgba(0, 0, 0, 0.52);
}

body {
  font-family: 'Avenir Next', 'Segoe UI', sans-serif;
  margin: 0;
  background: var(--bg);
  color: var(--text);
  transition: background 0.5s ease, color 0.5s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
  background: var(--bg);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  position: sticky;
  top: 0;
  background: var(--bg);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid var(--border);
}

.logo {
  font-weight: 800;
}

.navbar a {
  text-decoration: none;
  color: var(--text);
  margin-left: 20px;
  font-weight: 700;
  cursor: pointer;
}

.navbar a:hover {
  color: var(--primary);
}

.links {
  display: flex;
  align-items: center;
  gap: 18px;
}

.menu-toggle {
  display: none;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  background: var(--text);
  margin: 3px 0;
  border-radius: 999px;
}

.hero {
  text-align: center;
  padding: 72px 0 48px;
  max-width: 900px;
  margin: 0 auto;
}

.hero h1 {
  font-size: clamp(1rem, 5vw, 2rem);
  line-height: 1.02;
  margin: 10px 0 16px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--primary-strong);
  font-size: 0.78rem;
  font-weight: 800;
  margin: 0;
}

.highlight {
  color: var(--primary);
}

.subtitle {
  font-size: 1.2rem;
  color: var(--muted);
  max-width: 800px;
  margin: 0 auto;
  text-align: justify;
  white-space: pre-line;
}

.social-row {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.teaser-grid { max-width: 360px; margin: 0 auto 12px; }
.interests-actions { text-align: center; margin-top: 6px; }

.more-floating {
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 11px 8px 10px;
  border-radius: 999px 999px 999px 16px;
  background: color-mix(in srgb, var(--card-bg) 68%, var(--primary) 32%);
  color: #fff;
  box-shadow: 0 10px 22px var(--shadow-strong);
  text-decoration: none;
  font-weight: 700;
  letter-spacing: 0.01em;
  opacity: 0.34;
  z-index: 200;
  transform: translate(22%, 22%) scale(0.76);
  transition: transform 0.18s ease, background 0.18s ease, opacity 0.18s ease, box-shadow 0.18s ease;
}

.more-floating .paw {
  display: inline-flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  line-height: 1;
}

.more-floating .more-label {
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-6px);
  transition: max-width 0.18s ease, opacity 0.18s ease, transform 0.18s ease;
}

.more-floating:hover,
.more-floating:focus-visible {
  transform: translate(0, 0) scale(1);
  opacity: 1;
  background: var(--primary-strong);
  box-shadow: 0 12px 28px var(--shadow-strong);
}

.more-floating:hover .more-label,
.more-floating:focus-visible .more-label {
  max-width: 7rem;
  opacity: 1;
  transform: translateX(0);
}

.more-floating:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

@media (max-width: 520px) {
  .more-floating {
    right: 12px;
    bottom: 12px;
    transform: translate(32%, 32%) scale(0.7);
  }

  .more-floating .more-label {
    display: none;
  }
}

.btn {
  background: var(--text);
  color: var(--bg);
  padding: 9px 16px;
  border-radius: 50px;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s, color 0.2s, border-color 0.2s;
  font-size: 0.95rem;
}

.btn:hover {
  transform: translateY(-2px);
  background: var(--primary);
}

.primary-btn {
  background: var(--primary);
  color: #fff;
}

.primary-btn:hover {
  background: var(--primary-strong);
}

.secondary-btn {
  background: transparent;
  color: var(--text);
  border-color: var(--border);
}

.secondary-btn:hover {
  background: var(--card-bg);
  color: var(--text);
}

.social-btn {
  background: var(--card-bg);
  color: var(--text);
  border-color: var(--border);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 10px 20px -10px var(--shadow);
}

.section {
  padding: 56px 0;
}

.section h2 {
  font-size: clamp(1.6rem, 3.2vw, 2.3rem);
  margin-bottom: 22px;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.credibility-strip {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 22px;
}

.credibility-item {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 12px 14px;
  text-align: left;
  box-shadow: 0 18px 40px var(--shadow);
}

.credibility-label {
  display: block;
  color: var(--muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.credibility-value {
  display: block;
  font-weight: 700;
}

.journal {
  color: var(--muted);
  font-style: italic;
  margin: 0;
  font-size: 0.92rem;
}

.emoji {
  font-size: 2.2rem;
  margin-bottom: 8px;
}

.hobby-card {
  text-align: center;
  background: var(--card-bg);
}

.tilt-card {
  padding: 16px;
  border-radius: 14px;
}

.paper-tag {
  display: inline-flex;
  margin: 0 0 12px;
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(46, 139, 87, 0.12);
  color: var(--primary-strong);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.summary,
.details p:last-of-type {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
  -webkit-line-clamp: 3;
}

.summary {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}

.details h3 {
  margin-bottom: 6px;
}

.details p {
  margin: 0 0 8px;
}

.read-more {
  display: inline-flex;
  align-items: center;
  margin-top: 14px;
  padding: 7px 14px;
  background-color: rgba(46, 139, 87, 0.1);
  color: var(--primary);
  text-decoration: none;
  font-weight: bold;
  border-radius: 20px;
  font-size: 0.84rem;
  transition: all 0.3s ease;
}

.read-more:hover {
  background-color: var(--primary);
  color: white;
  transform: translateY(-2px);
}

.read-more::after {
  content: '→';
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.read-more:hover::after {
  transform: translateX(4px);
}

.timeline-item {
  display: flex;
  margin-bottom: 14px;
  border-left: 2px solid var(--primary);
  padding-left: 16px;
  gap: 14px;
}

.year {
  font-weight: bold;
  width: 92px;
  color: var(--primary);
  font-size: 0.9rem;
}

footer {
  text-align: center;
  padding: 40px;
  color: var(--muted);
}

.profile-container {
  margin-bottom: 16px;
}

.profile-pic {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary);
  box-shadow: 0 10px 20px var(--shadow);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-pic:hover {
  transform: scale(1.1) rotate(-4deg);
  box-shadow: 0 15px 30px var(--shadow-strong);
}

.resume-download {
  text-align: center;
  margin-top: 30px;
}

.contact-container {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.contact-container p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 18px;
  color: var(--muted);
}

.contact-btn {
  background-color: var(--card-bg);
  color: var(--text);
  padding: 12px 28px;
  font-size: 1rem;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 10px 30px var(--shadow);
  transition: transform 0.2s, background-color 0.2s;
  display: inline-block;
}

.contact-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px var(--shadow-strong);
}

@media (max-width: 900px) {
  .credibility-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .navbar {
    flex-wrap: wrap;
    gap: 14px;
  }

  .menu-toggle {
    display: inline-flex;
    flex-direction: column;
  }

  .links {
    width: 100%;
    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 14px 0 4px;
  }

  .links a {
    margin-left: 0;
  }

  .links[data-open='true'] {
    display: flex;
  }

  .hero {
    padding-top: 60px;
  }

  .timeline-item {
    flex-direction: column;
    gap: 6px;
  }

  .year {
    width: auto;
  }
}

@media (max-width: 520px) {
  .credibility-strip {
    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: 2.05rem;
  }

  .section {
    padding: 46px 0;
  }
}
</style>
