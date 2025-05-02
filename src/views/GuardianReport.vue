<template>
  <v-app>
    <v-main>
      <v-container fluid class="full-screen-container">
        <v-row justify="center" class="mb-6">
          <v-col cols="12" sm="6" md="4" class="text-center">
            <v-img src="../assets/header.png" max-height="80" max-width="240" class="mx-auto" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h1 class="text-h4 mb-4 text-center">Report a Non-Emergency Crime</h1>
            <p class="mb-4 text-center">
              Use this form to report non-emergency crimes. All information is confidential and will
              be reviewed by law enforcement.
            </p>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8" xl="8">
            <v-card class="report-form-container">
              <v-card-text>
                <form @submit.prevent="handleSubmit" class="report-form">
                  <h2 class="text-h5 mb-4">Reporter Information</h2>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.firstName"
                        label="First Name"
                        outlined
                        dense
                        color="#000c66"
                        :rules="[(v) => !!v || 'First name is required']"
                        :error-messages="errors.first_name"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.lastName"
                        label="Last Name"
                        outlined
                        dense
                        color="#000c66"
                        :rules="[(v) => !!v || 'Last name is required']"
                        :error-messages="errors.last_name"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.email"
                        label="Email"
                        outlined
                        dense
                        color="#000c66"
                        :rules="emailRules"
                        :error-messages="errors.email"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.phone"
                        label="Phone Number"
                        outlined
                        dense
                        color="#000c66"
                        :rules="[(v) => !!v || 'Phone number is required']"
                        :error-messages="errors.phone"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.address"
                        label="Address (Optional)"
                        outlined
                        dense
                        color="#000c66"
                      />
                    </v-col>
                  </v-row>
                  <h2 class="text-h5 mb-4 mt-6">Incident Details</h2>
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="formData.crime_type"
                        :items="crime_types"
                        label="Crime Type"
                        outlined
                        dense
                        color="#000c66"
                        :rules="[(v) => !!v || 'Crime type is required']"
                        :error-messages="errors.crime_type"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-menu
                        v-model="dateMenu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-model="formData.incident_date"
                            label="Incident Date"
                            prepend-icon="mdi-calendar"
                            readonly
                            outlined
                            dense
                            color="#000c66"
                            v-bind="props"
                            :rules="[(v) => !!v || 'Date is required']"
                            :error-messages="errors.incident_date"
                          />
                        </template>
                        <v-date-picker
                          v-model="formData.incident_date"
                          color="#E2E2F3"
                          @update:model-value="dateMenu = false"
                        />
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.incident_location"
                        label="Incident Location"
                        outlined
                        dense
                        color="#000c66"
                        :rules="[(v) => !!v || 'Location is required']"
                        :error-messages="errors.incident_location"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="formData.description"
                        label="Incident Description"
                        outlined
                        dense
                        placeholder="Describe the incident, including the approximate time it occurred, details about victim(s), suspect(s), and evidence"
                        color="#000c66"
                        :rules="[(v) => !!v || 'Description is required']"
                        :error-messages="errors.description"
                      />
                    </v-col>
                  </v-row>
                  <h2 class="text-h5 mb-4 mt-6">Attachments (Optional)</h2>
                  <v-row>
                    <v-col cols="12">
                      <v-file-input
                        v-model="formData.attachments"
                        label="Upload Evidence (Photos, Videos, Documents)"
                        multiple
                        accept="image/*,video/*,.pdf"
                        outlined
                        dense
                        color="#000c66"
                        :rules="attachmentRules"
                      />
                    </v-col>
                  </v-row>
                  <h2 class="text-h5 mb-4 mt-6">Witness Information (Optional)</h2>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.witnessName"
                        label="Witness Name"
                        outlined
                        dense
                        color="#000c66"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.witnessContact"
                        label="Witness Contact"
                        outlined
                        dense
                        color="#000c66"
                      />
                    </v-col>
                  </v-row>
                  <h2 class="text-h5 mb-4 mt-6">Follow-Up Preferences</h2>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="formData.allowContact"
                        label="I agree to be contacted for further details"
                        color="#000c66"
                        class="mt-0"
                      />
                    </v-col>
                  </v-row>
                  <h2 class="text-h5 mb-4 mt-6">Consent</h2>
                  <v-row>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="formData.consent"
                        label="I confirm this report is truthful to the best of my knowledge"
                        color="#000c66"
                        class="mt-0"
                        :rules="[(v) => !!v || 'You must confirm']"
                        :error-messages="errors.consent"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="text-center">
                      <v-btn
                        type="submit"
                        color="#000c66"
                        class="submit-btn"
                        style="
                          max-width: 300px;
                          width: 100%;
                          padding: 0.75rem;
                          color: #000c66;
                          background-color: #e2e2f3;
                          position: relative;
                        "
                        :disabled="isSubmitting"
                      >
                        <span v-if="!isSubmitting">Submit Report</span>
                        <div v-else class="spinner">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </v-btn>
                    </v-col>
                  </v-row>
                </form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import api from '../services/api'

export default {
  name: 'GuardianAlert',
  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        crime_type: '',
        incident_date: '',
        incident_location: '',
        description: '',
        attachments: [],
        witnessName: '',
        witnessContact: '',
        allowContact: false,
        consent: false,
      },
      errors: {},
      crime_types: ['Theft', 'Vandalism', 'Harassment', 'Fraud', 'Other'],
      dateMenu: false,
      isSubmitting: false,
      attachmentRules: [
        (files) =>
          !files ||
          files.every((file) => file.size < 10 * 1024 * 1024) ||
          'Files must be less than 10MB',
        (files) => !files || files.length <= 5 || 'Maximum 5 files allowed',
      ],
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
    }
  },
  methods: {
    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.formData.firstName) {
        this.errors.first_name = 'First name is required'
        isValid = false
      }
      if (!this.formData.lastName) {
        this.errors.last_name = 'Last name is required'
        isValid = false
      }
      if (!this.formData.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
        this.errors.email = 'Please enter a valid email'
        isValid = false
      }
      if (!this.formData.phone) {
        this.errors.phone = 'Phone number is required'
        isValid = false
      }
      if (!this.formData.crime_type) {
        this.errors.crime_type = 'Crime type is required'
        isValid = false
      }
      if (!this.formData.incident_date) {
        this.errors.incident_date = 'Incident date is required'
        isValid = false
      }
      if (!this.formData.incident_location) {
        this.errors.incident_location = 'Incident location is required'
        isValid = false
      }
      if (!this.formData.description.trim()) {
        this.errors.description = 'Incident description is required'
        isValid = false
      }
      if (!this.formData.consent) {
        this.errors.consent = 'You must confirm the report is truthful'
        isValid = false
      }

      return isValid
    },
    async handleSubmit() {
      if (this.validateForm()) {
        this.isSubmitting = true
        try {
          const formData = new FormData()
          formData.append('first_name', this.formData.firstName)
          formData.append('last_name', this.formData.lastName)
          formData.append('email', this.formData.email)
          formData.append('phone', this.formData.phone)
          formData.append('address', this.formData.address)
          formData.append('crime_type', this.formData.crime_type)
          formData.append(
            'incident_date',
            this.formData.incident_date
              ? new Date(this.formData.incident_date).toISOString().split('T')[0]
              : '',
          )
          formData.append('incident_location', this.formData.incident_location)
          formData.append('description', this.formData.description)
          this.formData.attachments.forEach((file) => formData.append('attachments[]', file))
          formData.append('witnessName', this.formData.witnessName)
          formData.append('witnessContact', this.formData.witnessContact)
          formData.append('allowContact', this.formData.allowContact ? 1 : 0)
          formData.append('consent', this.formData.consent ? 1 : 0)

          console.log('Sending form data to /reports')
          const response = await api.post('/reports', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })

          console.log('API response status:', response.status)
          if (response.status === 200 || response.status === 201) {
            console.log('Report submitted successfully! Redirecting to /GrConfirmation')
            this.$router.push('/GrConfirmation')
          } else {
            console.error('Unexpected response status:', response.status)
            this.errors = { general: 'Submission failed. Please try again.' }
          }
        } catch (error) {
          console.error('Submission error:', error.message)
          if (error.response) {
            console.error('Error response:', error.response.data)
            this.errors = error.response.data.errors || {
              general: 'Submission failed: ' + error.response.data.message,
            }
          } else {
            console.error('Network or other error:', error)
            this.errors = {
              general: 'Failed to submit report. Please check your connection and try again.',
            }
          }
        } finally {
          this.isSubmitting = false
        }
      }
    },
  },
}
</script>

<style scoped>
.full-screen-container {
  padding: 24px;
  min-height: 100vh;
  background: #f5f5f5;
}
.report-form-container {
  width: 100%;
  max-width: 1200px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background: white;
}
.report-form {
  width: 100%;
}
.v-text-field,
.v-textarea,
.v-select,
.v-file-input {
  margin-bottom: 8px;
}
.submit-btn {
  position: relative;
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.submit-btn:active {
  transform: translateY(1px);
}
.text-h5 {
  color: #000c66;
  font-weight: 600;
}
.text-h4 {
  color: #000c66;
  font-weight: 700;
}
.spinner {
  position: absolute;
  width: 9px;
  height: 9px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.spinner div {
  position: absolute;
  width: 50%;
  height: 150%;
  background: #000000;
  transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
  animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease;
}
.spinner div:nth-child(1) {
  --delay: 0.1;
  --rotation: 36;
  --translation: 150;
}
.spinner div:nth-child(2) {
  --delay: 0.2;
  --rotation: 72;
  --translation: 150;
}
.spinner div:nth-child(3) {
  --delay: 0.3;
  --rotation: 108;
  --translation: 150;
}
.spinner div:nth-child(4) {
  --delay: 0.4;
  --rotation: 144;
  --translation: 150;
}
.spinner div:nth-child(5) {
  --delay: 0.5;
  --rotation: 180;
  --translation: 150;
}
.spinner div:nth-child(6) {
  --delay: 0.6;
  --rotation: 216;
  --translation: 150;
}
.spinner div:nth-child(7) {
  --delay: 0.7;
  --rotation: 252;
  --translation: 150;
}
.spinner div:nth-child(8) {
  --delay: 0.8;
  --rotation: 288;
  --translation: 150;
}
.spinner div:nth-child(9) {
  --delay: 0.9;
  --rotation: 324;
  --translation: 150;
}
.spinner div:nth-child(10) {
  --delay: 1;
  --rotation: 360;
  --translation: 150;
}
@keyframes spinner-fzua35 {
  0%,
  10%,
  20%,
  30%,
  50%,
  60%,
  70%,
  80%,
  90%,
  100% {
    transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
  }
  50% {
    transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
  }
}
</style>
