import axios from 'axios'
import router from '../router/index'
import TokenService from './token.service'

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Authorization header set:', config.headers.Authorization)
    } else {
      console.warn('No token found for request')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized request, redirecting to login')
      TokenService.removeToken()
      router.push('/LoginPage')
    }
    return Promise.reject(error)
  },
)

export default instance
