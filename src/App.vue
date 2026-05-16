<script setup>
import { computed, onMounted, ref } from 'vue';
import SunCalc from 'suncalc';
import { profile, papers, interests, experience } from './data.js';
import TiltCard from './components/TiltCard.vue';
import profileImg from './assets/profile.jpg';
import NeuroSwitch from './components/NeuroSwitch.vue';

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
        <a @click.prevent="scrollTo('interests')" href="#">Interests</a>
        <a @click.prevent="scrollTo('contact')" href="#">Contact</a>
        <NeuroSwitch :initial-state="themeState" @toggle="handleThemeToggle" />
      </div>
    </nav>

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

    <section id="interests" class="section">
      <h2>🧩 Personal Interests</h2>
      <div class="grid">
        <TiltCard v-for="hobby in interests" :key="hobby.name" class="hobby-card">
          <div class="emoji">{{ hobby.emoji }}</div>
          <h3>{{ hobby.name }}</h3>
        </TiltCard>
      </div>
    </section>

    <section id="contact" class="section alt-bg">
      <h2>📬 Get in Touch</h2>
      <div class="contact-container">
        <p>{{ profile.contactMessage }}</p>

        <a :href="`mailto:${profile.email}`" class="btn contact-btn">
          ✉️ {{ profile.email }}
        </a>
      </div>
    </section>

    <footer>
      <p>© 2025 Built with Vue.js</p>
    </footer>
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
  padding: 96px 0 72px;
  max-width: 900px;
  margin: 0 auto;
}

.hero h1 {
  font-size: clamp(2.5rem, 6vw, 4.8rem);
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
  font-size: 1rem;
  color: var(--muted);
  max-width: 720px;
  margin: 0 auto;
}

.social-row {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.btn {
  background: var(--text);
  color: var(--bg);
  padding: 10px 20px;
  border-radius: 50px;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s, color 0.2s, border-color 0.2s;
  font-size: 1rem;
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
  gap: 8px;
}

.section {
  padding: 76px 0;
}

.section h2 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  margin-bottom: 34px;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.credibility-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 34px;
}

.credibility-item {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 16px;
  text-align: left;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.06);
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
}

.emoji {
  font-size: 3rem;
  margin-bottom: 10px;
}

.hobby-card {
  text-align: center;
  background: var(--card-bg);
}

.paper-tag {
  display: inline-flex;
  margin: 0 0 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(46, 139, 87, 0.12);
  color: var(--primary-strong);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.read-more {
  display: inline-flex;
  align-items: center;
  margin-top: 20px;
  padding: 8px 16px;
  background-color: rgba(46, 139, 87, 0.1);
  color: var(--primary);
  text-decoration: none;
  font-weight: bold;
  border-radius: 20px;
  font-size: 0.9rem;
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
  margin-bottom: 20px;
  border-left: 2px solid var(--primary);
  padding-left: 20px;
}

.year {
  font-weight: bold;
  width: 100px;
  color: var(--primary);
}

footer {
  text-align: center;
  padding: 40px;
  color: var(--muted);
}

.profile-container {
  margin-bottom: 20px;
}

.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--primary);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profile-pic:hover {
  transform: scale(1.2) rotate(-5deg);
  box-shadow: 0 15px 30px rgba(66, 184, 131, 0.4);
}

.resume-download {
  text-align: center;
  margin-top: 50px;
}

.contact-container {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.contact-container p {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: var(--muted);
}

.contact-btn {
  background-color: var(--card-bg);
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
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(66, 184, 131, 0.6);
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
    padding-top: 72px;
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
    font-size: 2.35rem;
  }
}
</style>
