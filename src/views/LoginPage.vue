<script setup>
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'
</script>

<template>
  <div>
    <h1>Hitori: Temp Login Page</h1>
    <a :href="`${API}/auth/google`">Login with evil google</a>
    <br>
    <a :href="`${API}/auth/discord`">Login with eviler discord</a>
  </div>
</template>
