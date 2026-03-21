<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { api } from '@/services/api'
import { useCharacterStore } from '@/stores/character';

const char = useCharacterStore()
const status = ref('')

onMounted(() => {
  //init test character if none loaded
  if (!char.name) {
    char.name = 'TestMono'
    char.birthday = '2009-09-30'
    char.catchphrase = 'haii'
    char.personality.patience = 80
    char.personality.energyLevel = 60
    char.personality.pickiness = 100
    char.personality.sociability = 15
    char.personality.optimism = 10
  }
  char.startTicking()
})

onUnmounted(() => {
  char.stopTicking()
})

async function save() {
  try {
    await api.putSave(char.toJSON())
    status.value = 'saved'
  }  catch (e) {
    status.value = e.message
  }
}

async function load() {
  try {
    const res = await api.getSave()
    char.loadFromSave(res.data)
    status.value = 'loaded'
  } catch (e) {
    status.value = e.message
  }
}
</script>

<template>
  <div style="font-family: monospace; padding: 20px;">
    <h1>TEST PAGE - {{ char.name }}</h1>
    <p>Mood: <strong>{{ char.mood }}</strong> | Activity: <strong>{{ char.activity }}</strong></p>
    <p>Level: {{ char.level }} | XP: {{ char.xp }}</p>

    <h2>Needs</h2>
    <div v-for="(val, key) in char.needs" :key="key">
      {{ key }}: {{ val.toFixed(1) }}
      <div style="background: #6077EA; width: 200px; height: 12px; display: inline-block; vertical-align: middle;">
        <div :style="{ background: val > 30 ? '#FF4893' : '#f44336', width: val + '%', height: '100%'}" />
      </div>
    </div>

    <h2>Personality</h2>
    <div v-for="(val, key) in char.personality" :key="key">
      {{  key }}: {{ val }}
    </div>

    <h2>Actions</h2>
    <button @click="char.feed('apple')" :disabled="char.isAsleep()">Feed</button>
    <button @click="char.play('cards')" :disabled="char.isAsleep()">Play</button>
    <button @click="char.bathe()" :disabled="char.isAsleep()">Bathe</button>

    <h2>save</h2>
    <br />
    <button @click="save">save</button>
    <button @click="load">load</button>

    <p>status: {{ status }}</p>
  </div>
</template>
