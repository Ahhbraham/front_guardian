import router from '../router/index'
import api from '../services/api'

class TokenService {
  // Set token in localStorage
  setToken(token) {
    localStorage.setItem('authToken', token)
  }

  // Get token from localStorage
  getToken() {
    const token = localStorage.getItem('authToken')
    console.log('This is my Token --->>', token)
    return token
  }

  // Remove token from localStorage and redirect to login page
  removeToken() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user') // Optionally clear user data
    router.push('/LoginPage') // Redirect to login page
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken() // Return true if token exists, false otherwise
  }

  // Fetch user info and store it in localStorage
  async userInfo() {
    try {
      const response = await api.get('me') // Make API request to get user info
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data)) // Store user info
      }
    } catch (error) {
      console.error('No Authenticated User Was Found', error)
    }
  }
}

const myTokenInstance = new TokenService()
export default myTokenInstance
