<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  if (!auth.isLoggedIn) router.replace('/login')
})

function logout() {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="home">
    <h1>you're signed in</h1>
    <p class="sub">your Mono lives in the terminal app</p>
    <p class="cmd"><code>hitori</code></p>
    <button @click="logout">sign out</button>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
.home {
  font-family: system-ui, sans-serif;
  background: #0e0e14;
  color: #e0e0f0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}
h1 { color: #688BFF; font-size: 1.8rem; font-weight: 700; }
.sub { color: #9090BB; font-size: 0.95rem; }
.cmd { margin: 0.25rem 0 1rem; }
code {
  color: #FF4893;
  background: #1a1a28;
  padding: 3px 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.95rem;
}
button {
  background: transparent;
  border: 1px solid #2e2e44;
  color: #9090BB;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: border-color 0.15s, color 0.15s;
}
button:hover { border-color: #688BFF; color: #688BFF; }
</style>
