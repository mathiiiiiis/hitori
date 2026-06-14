import { useAuthStore } from '@/stores/auth'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(method, path, body) {
  const auth = useAuthStore()

  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json',
    },
  }

  if (body !== undefined) opts.body = JSON.stringify(body)

  const res = await fetch(`${API}${path}`, opts)

  if (res.status === 401) {
    auth.logout()
    window.location.href = '/login'
    return
  }

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)

  return res.json()
}

export const api = {
  getMe: () => request('GET', '/me'),
}
