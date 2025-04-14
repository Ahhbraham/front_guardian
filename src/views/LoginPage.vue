<template>
  <div class="login-container">
    <!-- Header Icon with reduced margin -->
    <img src="../assets/header.png" class="header-icon" />
    <!-- Login Form -->
    <form @submit.prevent>
      <!-- Username/Email Input -->
      <div class="form-item">
        <div class="input-wrapper">
          <input
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
      <!-- Password Input with Toggle -->
      <div class="form-item">
        <div class="input-wrapper">
          <input
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
      <!-- Submit Button() -->
      <button id="submit">Sign in</button>
      <!-- Sign up link -->
      <div class="signup-link">
        Don't have an account? <router-link to="/RegisterPage">Sign up</router-link>
      </div>
    </form>
  </div>
</template>

<script>
//below is login logic
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../services/auth.service'

const router = useRouter()
const { login, loading, error } = useAuth()

// Form fields
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const form = ref(null)

// Validation rules
const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const passwordRules = [(v) => !!v || 'Password is required']

// Login handler with form validation
async function handleLogin() {
  // Validate form before submission
  const isValid = form.value?.validate()

  if (!isValid) {
    return
  }

  if (!email.value || !password.value) {
    console.error('Email and password are required')
    return
  }

  try {
    await login({
      email: email.value,
      password: password.value,
    })

    // Redirect after successful login
    router.push('/welcome')
  } catch (err) {
    // Error is already handled by the auth service
    console.error('Login failed', err)
  }
}
//above is login logic
export default {
  name: 'LoginForm',
  data() {
    return {
      showPassword: false, // Controls password visibility
      beamDegrees: 0, // Controls the angle of the beam effect
    }
  },
  mounted() {
    // Add mouse move listener for beam effect
    document.addEventListener('mousemove', this.handleMouseMove)
  },
  beforeDestroy() {
    // Clean up mouse move listener
    document.removeEventListener('mousemove', this.handleMouseMove)
  },
  methods: {
    togglePassword() {
      // Toggle password visibility
      this.showPassword = !this.showPassword
      document.body.classList.toggle('show-password')
    },
    handleMouseMove(e) {
      // Handle beam effect based on mouse position
      if (!this.$refs.beam) return

      const rect = this.$refs.beam.getBoundingClientRect()
      const mouseX = rect.right + rect.width / 2
      const mouseY = rect.top + rect.height / 2
      const rad = Math.atan2(mouseX - e.pageX, mouseY - e.pageY)
      const degrees = rad * (20 / Math.PI) * -1 - 350

      this.beamDegrees = degrees
    },
  },
}
</script>

<style scoped>
/* Base styling variables */
.login-container {
  --bgColor: #f5f5f5;
  --inputColor: #000000; /* Changed to black for better visibility */
  --outlineColor: #000c66;
  --beamColor: #d7d7d7;
  --spacer: 1.5rem; /* Further reduced to bring elements closer */

  display: grid;
  place-items: center;
  height: 100vh;
  background: var(--bgColor);
}

/* Header icon styling with reduced margin */
.header-icon {
  width: 170px; /* Smaller size */
  height: 170px; /* Smaller size */
  margin: 0px;
}

/* Password visibility toggle styling */
.show-password .login-container {
  --bgColor: #000c66;
  --inputColor: #000000; /* Changed to black for better visibility */
  --outlineColor: #ffffff;
}

/* Form container styling */
form {
  transform: translate3d(0, 0, 0);
  padding: var(--spacer);
  margin-top: 0.2rem; /* Added to control spacing from icon */
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
  color: var(--inputColor); /* Use the variable here */
}

/* Input field styling */
input {
  padding: 0.75rem 4rem 0.75rem 0.75rem;
  width: 100%;
  border: 3px solid #000c66;
  border-radius: 4px;
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #e2e2f3;
  color: var(--inputColor); /* Use the variable here */
}

/* Placeholder styling */
::placeholder {
  color: #666; /* Dark gray for better visibility */
  opacity: 1; /* Ensure full opacity */
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
