<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  const hash = window.location.hash
  const token = new URLSearchParams(hash.substring(1)).get('token')

  if (token) {
    auth.setToken(token)
    router.replace('/')
  } else {
    router.replace('/login')
  }
})
</script>

<template>
  <p>Logging in...</p>
</template>
