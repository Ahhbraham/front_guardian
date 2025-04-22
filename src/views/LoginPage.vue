<template>
  <div class="login-container">
    <img src="../assets/header.png" class="header-icon" />
    <form @submit.prevent="handleLogin">
      <div class="form-item">
        <div class="input-wrapper">
          <input
            v-model="email"
            type="text"
            id="username"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            data-lpignore="true"
            placeholder="Email"
          />
        </div>
      </div>
      <div class="form-item">
        <div class="input-wrapper">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            data-lpignore="true"
            placeholder="Password"
          />
          <button type="button" id="eyeball" @click="togglePassword" @mousedown.prevent>
            <div class="eye"></div>
          </button>
          <div id="beam" ref="beam"></div>
        </div>
      </div>
      <button type="submit" id="submit">Sign in</button>
      <div class="signup-link">
        Don't have an account? <router-link to="/RegisterPage">Sign up</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../services/auth.service'

export default {
  name: 'LoginForm',
  setup() {
    const router = useRouter()
    const authService = useAuth()

    // Form data
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const beam = ref(null)
    const beamDegrees = ref(0)

    // Handle mouse movement for beam effect
    function handleMouseMove(e) {
      if (!beam.value) return

      const rect = beam.value.getBoundingClientRect()
      const mouseX = rect.right + rect.width / 2
      const mouseY = rect.top + rect.height / 2
      const rad = Math.atan2(mouseX - e.pageX, mouseY - e.pageY)
      const degrees = rad * (20 / Math.PI) * -1 - 350
      beamDegrees.value = degrees
    }

    // Toggle password visibility
    function togglePassword() {
      showPassword.value = !showPassword.value
      document.body.classList.toggle('show-password')
    }

    // Handle login submission
    async function handleLogin() {
      // Basic validation
      if (!email.value || !password.value) {
        console.error('Email and password are required')
        return
      }

      try {
        await authService.login({
          email: email.value,
          password: password.value,
        })
        router.push('/HomePage')
      } catch (err) {
        console.error('Login failed:', err)
      }
    }

    return {
      email,
      password,
      showPassword,
      beam,
      beamDegrees,
      togglePassword,
      handleLogin,
      handleMouseMove,
      loading: authService.loading,
      error: authService.error,
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.handleMouseMove)
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove)
  },
}
</script>

<style scoped>
/* Base styling variables */
.login-container {
  --bgColor: #f5f5f5;
  --inputColor: #000000;
  --outlineColor: #000c66;
  --beamColor: #d7d7d7;
  --spacer: 1.5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background: var(--bgColor);
  position: relative;
}

/* Header icon styling */
.header-icon {
  width: 170px;
  height: 170px;
  position: absolute;
  top: 1px;
}

/* Password visibility toggle styling */
.show-password .login-container {
  --bgColor: #000c66;
  --inputColor: #000000;
  --outlineColor: #ffffff;
}

/* Form container styling */
form {
  transform: translate3d(0, 0, 0);
  padding: var(--spacer);
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.362);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

/* Form item spacing */
form > * + * {
  margin-top: var(--spacer);
}

.form-item > * + * {
  margin-top: 0rem;
}

/* Base typography styling */
label,
input,
button {
  font-size: 1.5rem;
  font-family: Nunito, sans-serif;
  color: var(--inputColor);
}

/* Input field styling */
input {
  padding: 0.75rem 4rem 0.75rem 0.75rem;
  width: 100%;
  border: 3px solid #000c66;
  border-radius: 4px;
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #e2e2f3;
  color: var(--inputColor);
}

/* Placeholder styling */
::placeholder {
  color: #666;
  opacity: 1;
}

/* Focus states */
input:focus {
  outline: 1px solid #000c66;
  outline-offset: 2px;
}

/* Submit button styling */
#submit {
  border-radius: 2px;
  cursor: pointer;
  margin: calc(var(--spacer) * 1.5) 0 0 2px;
  padding: 0.75rem 10rem;
  color: #000c66;
  background-color: #e2e2f3;
  border: none;
  font-size: 1.1rem;
}

#submit:active {
  transform: translateY(1px);
}

/* Input wrapper positioning */
.input-wrapper {
  position: relative;
  overflow: visible;
}

/* Password visibility states */
.show-password input {
  box-shadow: inset 0 0 0 2px black;
  border: 2px dashed white;
}

.show-password input:focus {
  outline: none;
  border-color: var(--beamColor);
}

/* Eye icon button styling */
#eyeball {
  --size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  position: absolute;
  top: 50%;
  right: 0.75rem;
  border: none;
  background-color: transparent;
  transform: translateY(-50%);
}

#eyeball:active {
  transform: translateY(calc(-50% + 1px));
}

/* Eye icon styling */
.eye {
  width: var(--size);
  height: var(--size);
  border: 2px solid #000000;
  border-radius: calc(var(--size) / 1.5) 0;
  transform: rotate(45deg);
  position: relative;
}

.eye:before,
.eye:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-radius: 100%;
}

.eye:before {
  width: 35%;
  height: 35%;
  background-color: var(--inputColor);
}

.eye:after {
  width: 65%;
  height: 65%;
  border: 2px solid var(--inputColor);
  border-radius: 100%;
}

/* Beam effect styling */
#beam {
  position: absolute;
  top: 50%;
  right: 1.75rem;
  clip-path: polygon(100% 50%, 100% 50%, 0 0, 0 100%);
  width: 100vw;
  height: 25vw;
  z-index: 1;
  mix-blend-mode: multiply;
  transition: transform 200ms ease-out;
  transform-origin: 100% 50%;
  transform: translateY(-50%) rotate(v-bind('beamDegrees + "deg"'));
  pointer-events: none;
}

.show-password #beam {
  background: var(--beamColor);
}

/* Sign up link styling */
.signup-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 1rem;
  color: #000000;
}

.signup-link a {
  color: #000c66;
  text-decoration: none;
  font-weight: 800px;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
