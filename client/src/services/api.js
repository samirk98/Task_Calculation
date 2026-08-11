import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const register = (email, password) =>
  api.post('/auth/register', { email, password })

export const login = (email, password) =>
  api.post('/auth/login', { email, password })

export const getMe = () =>
  api.get('/auth/me')

// Sessions
export const startSession = (category) =>
  api.post('/sessions/start', { category })

export const finishSession = (id) =>
  api.post(`/sessions/${id}/finish`)

export const getActiveSession = () =>
  api.get('/sessions/active')

// Stats
export const getStats = () =>
  api.get('/stats')

export default api
