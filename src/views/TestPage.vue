<script setup>
import { ref } from 'vue';
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore()
const saveData = ref(null)
const input = ref('{ "hunger": 41, "happiness": 100}')
const status = ref('')

async function load() {
  try {
    saveData.value = await api.getSave()
    status.value = 'loaded'
  }  catch (e) {
    status.value = e.message
  }
}

async function save() {
  try {
    const data = JSON.parse(input.value)
    saveData.value = await api.putSave(data)
    status.value = 'saved'
  } catch (e) {
    status.value = e.message
  }
}
</script>

<template>
  <div>
    <h1>TEST PAGE</h1>
    <p>logged in: {{ auth.isLoggedIn }}</p>
    <p>token: {{ auth.token ? 'yes' : 'no tokens' }}</p>

    <h2>save</h2>
    <textarea v-model="input" rows="5" cols="40" />
    <br />
    <button @click="save">PUT /save</button>
    <button @click="load">GET /save</button>

    <p>status: {{ status }}</p>
    <pre>{{ JSON.stringify(saveData, null, 2) }}</pre>
  </div>
</template>
