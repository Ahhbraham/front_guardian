<template>
  <div class="register-container">
    <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
      <div class="form-header">
        <h1>Create Account</h1>
      </div>

      <div class="form-item">
        <div class="input-wrapper">
          <input
            type="text"
            id="name"
            v-model="formData.name"
            required
            autocomplete="name"
            placeholder="Full Name"
          />
        </div>
        <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
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
            type="password"
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
            type="password"
            id="password_confirmation"
            v-model="formData.password_confirmation"
            required
            autocomplete="new-password"
            placeholder="Confirm Password"
          />
        </div>
        <span class="error-message" v-if="errors.password_confirmation">{{
          errors.password_confirmation
        }}</span>
      </div>

      <!-- Moved file input to be last before submit button with placeholder -->
      <div class="form-item">
        <div class="input-wrapper">
          <input
            type="file"
            id="user_photo"
            @change="handleFileUpload"
            accept="image/*"
            placeholder="Profile pic"
          />
        </div>
        <span class="error-message" v-if="errors.user_photo">{{ errors.user_photo }}</span>
      </div>

      <button id="submit" type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>

      <div class="registration-error" v-if="registrationError">
        {{ registrationError }}
      </div>

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
      isLoading: false,
      registrationError: '',
      formData: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_photo: null,
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
    handleFileUpload(event) {
      this.formData.user_photo = event.target.files[0]
    },
    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.formData.name.trim()) {
        this.errors.name = 'Full name is required'
        isValid = false
      }

      if (!this.formData.email.trim()) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
        this.errors.email = 'Please enter a valid email'
        isValid = false
      }

      if (!this.formData.password) {
        this.errors.password = 'Password is required'
        isValid = false
      } else if (this.formData.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters'
        isValid = false
      }

      if (this.formData.password !== this.formData.password_confirmation) {
        this.errors.password_confirmation = 'Passwords do not match'
        isValid = false
      }

      return isValid
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      this.registrationError = ''

      try {
        const formData = new FormData()
        formData.append('name', this.formData.name)
        formData.append('email', this.formData.email)
        formData.append('password', this.formData.password)
        formData.append('password_confirmation', this.formData.password_confirmation)
        if (this.formData.user_photo) {
          formData.append('user_photo', this.formData.user_photo)
        }

        const response = await fetch('http://127.0.1:8000/api/register', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed')
        }

        console.log('Registration successful:', data)
        this.$router.push('/HomePage')
      } catch (error) {
        console.error('Registration error:', error)
        this.registrationError = error.message || 'Registration failed. Please try again.'

        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors
        }
      } finally {
        this.isLoading = false
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
  color: #000;
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

#submit:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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

.registration-error {
  color: #ff6b6b;
  text-align: center;
  margin-top: 1rem;
}
</style>
