<template>
  <div class="register-container">
    <form @submit.prevent="handleSubmit">
      <div class="form-header">
        <h1>Create Account</h1>
      </div>

      <div class="form-row">
        <div class="form-item">
          <div class="input-wrapper">
            <input
              type="text"
              id="firstName"
              v-model="formData.firstName"
              required
              autocomplete="given-name"
              placeholder="First Name"
            />
          </div>
          <span class="error-message" v-if="errors.firstName">{{ errors.firstName }}</span>
        </div>

        <div class="form-item">
          <div class="input-wrapper">
            <input
              type="text"
              id="lastName"
              v-model="formData.lastName"
              required
              autocomplete="family-name"
              placeholder="Last Name"
            />
          </div>
          <span class="error-message" v-if="errors.lastName">{{ errors.lastName }}</span>
        </div>
      </div>

      <div class="form-item">
        <div class="input-wrapper">
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            autocomplete="email"
            placeholder="Email"
          />
        </div>
        <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
      </div>

      <div class="form-item">
        <div class="input-wrapper">
          <input
            type="text"
            id="username"
            v-model="formData.username"
            required
            autocomplete="username"
            placeholder="Username"
          />
        </div>
        <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
      </div>

      <div class="form-item">
        <div class="input-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="formData.password"
            required
            autocomplete="new-password"
            placeholder="Password"
          />
        </div>
        <div class="password-strength" :class="passwordStrengthClass">
          {{ passwordStrengthMessage }}
        </div>
        <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
      </div>

      <div class="form-item">
        <div class="input-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            required
            autocomplete="new-password"
            placeholder="Confirm Password"
          />
        </div>
        <span class="error-message" v-if="errors.confirmPassword">{{
          errors.confirmPassword
        }}</span>
      </div>

      <button id="submit" type="submit">Register</button>

      <div class="login-link">
        Already have an account? <router-link to="/LoginPage">Sign in</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  data() {
    return {
      showPassword: false,
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      },
      errors: {},
    }
  },
  computed: {
    passwordStrength() {
      if (!this.formData.password) return 0

      let strength = 0
      if (this.formData.password.length >= 8) strength += 1
      if (this.formData.password.length >= 12) strength += 1
      if (/[A-Z]/.test(this.formData.password)) strength += 1
      if (/[0-9]/.test(this.formData.password)) strength += 1
      if (/[^A-Za-z0-9]/.test(this.formData.password)) strength += 1

      return strength
    },
    passwordStrengthClass() {
      return {
        weak: this.passwordStrength <= 2,
        medium: this.passwordStrength > 2 && this.passwordStrength <= 4,
        strong: this.passwordStrength > 4,
      }
    },
    passwordStrengthMessage() {
      if (!this.formData.password) return ''
      if (this.passwordStrength <= 2) return 'Weak password'
      if (this.passwordStrength <= 4) return 'Medium strength'
      return 'Strong password'
    },
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.formData.firstName.trim()) {
        this.errors.firstName = 'First name is required'
        isValid = false
      }

      if (!this.formData.lastName.trim()) {
        this.errors.lastName = 'Last name is required'
        isValid = false
      }

      if (!this.formData.email.trim()) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
        this.errors.email = 'Please enter a valid email'
        isValid = false
      }

      if (!this.formData.username.trim()) {
        this.errors.username = 'Username is required'
        isValid = false
      } else if (this.formData.username.length < 4) {
        this.errors.username = 'Username must be at least 4 characters'
        isValid = false
      }

      if (!this.formData.password) {
        this.errors.password = 'Password is required'
        isValid = false
      } else if (this.formData.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters'
        isValid = false
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match'
        isValid = false
      }

      return isValid
    },
    handleSubmit() {
      if (this.validateForm()) {
        console.log('Registration data:', this.formData)
        this.$router.push('/login')
      }
    },
  },
}
</script>

<style scoped>
.register-container {
  --bgColor: #f5f5f5;
  --inputColor: rgb(255, 255, 255);
  --outlineColor: #000c66;
  --spacer: 1.5rem;

  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: var(--spacer);
  background: var(--bgColor);
}

.input-wrapper {
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 3px solid #000c66;
  background-color: transparent;
  border-radius: 4px;
  color: #ffffff;
}

.form-header {
  text-align: center;
  margin-bottom: var(--spacer);
}

.form-header h1 {
  color: #000c66;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.form-row {
  display: flex;
  gap: var(--spacer);
}

.form-row .form-item {
  flex: 1;
}

form {
  width: 100%;
  max-width: 600px;
  padding: var(--spacer);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.362);
}

form > * + * {
  margin-top: var(--spacer);
}

.form-item > * + * {
  margin-top: 0.5rem;
}

label,
input,
button {
  font-size: 1.2rem;
  font-family: Nunito, sans-serif;
  color: #e2e2f3;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.875rem;
  display: block;
  margin-top: 0.25rem;
}

.password-strength {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.password-strength.weak {
  color: #ff6b6b;
}

.password-strength.medium {
  color: #feca57;
}

.password-strength.strong {
  color: #1dd1a1;
}

#submit {
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
  margin-top: calc(var(--spacer) * 1.5);
  padding: 0.75rem 1.25rem;
  color: #000c66;
  background-color: #e2e2f3;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s;
}

#submit:hover {
  background-color: #c9c9e8;
}

#submit:active {
  transform: translateY(1px);
}

.login-link {
  text-align: center;
  margin-top: var(--spacer);
  color: #000c66;
}

.login-link a {
  color: #000c66;
  text-decoration: underline;
}
</style>
