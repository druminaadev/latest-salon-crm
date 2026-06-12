import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/auth/login'
      }
    }
    
    if (error.response?.status === 403) {
      console.error('Access forbidden')
    }
    
    if (error.response?.status === 429) {
      console.error('Too many requests')
    }
    
    if (error.response && error.response.status >= 500) {
      console.error('Server error')
    }
    
    return Promise.reject(error)
  }
)

export default api
