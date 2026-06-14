<script setup>
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'
</script>

<template>
  <div class="login">
    <h1>hitori</h1>
    <p class="sub">sign in to sync your Mono</p>
    <div class="buttons">
      <a :href="`${API}/auth/discord`" class="btn discord">Continue with Discord</a>
      <a :href="`${API}/auth/google`" class="btn google">Continue with Google</a>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.login {
  font-family: system-ui, sans-serif;
  background: #0e0e14;
  color: #e0e0f0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
h1 { color: #688BFF; font-size: 2.5rem; font-weight: 700; }
.sub { color: #9090BB; font-size: 0.95rem; margin-bottom: 0.5rem; }
.buttons { display: flex; flex-direction: column; gap: 0.75rem; width: 240px; }
.btn {
  display: block;
  text-align: center;
  padding: 11px 0;
  border-radius: 8px;
  font-size: 0.95rem;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.15s;
}
.btn:hover { opacity: 0.85; }
.discord { background: #5865F2; color: #fff; }
.google  { background: #1a1a28; color: #e0e0f0; border: 1px solid #2e2e44; }
</style>
