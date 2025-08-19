import axios from 'axios'

const api = axios.create({
  baseURL: 'https://gamersunite-backend.onrender.com:4000',
  withCredentials: false
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
