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
                        :disabled="formData.anonymous"
                        :rules="[(v) => !!v || 'First name is required']"
                        :error-messages="errors.firstName"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.lastName"
                        label="Last Name"
                        outlined
                        dense
                        color="#000c66"
                        :disabled="formData.anonymous"
                        :rules="[(v) => !!v || 'Last name is required']"
                        :error-messages="errors.lastName"
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
                        :disabled="formData.anonymous"
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
                        :disabled="formData.anonymous"
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
                        :disabled="formData.anonymous"
                      />
                    </v-col>
                  </v-row>
                  <v-checkbox
                    v-model="formData.anonymous"
                    label="Submit anonymously (if permitted by law)"
                    color="#000c66"
                    class="mt-0"
                  />
                  <h2 class="text-h5 mb-4 mt-6">Incident Details</h2>
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="formData.crimeType"
                        :items="crimeTypes"
                        label="Crime Type"
                        outlined
                        dense
                        color="#000c66"
                        :rules="[(v) => !!v || 'Crime type is required']"
                        :error-messages="errors.crimeType"
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
                            v-model="formData.incidentDate"
                            label="Incident Date"
                            prepend-icon="mdi-calendar"
                            readonly
                            outlined
                            dense
                            color="#000c66"
                            v-bind="props"
                            :rules="[(v) => !!v || 'Date is required']"
                            :error-messages="errors.incidentDate"
                          />
                        </template>
                        <v-date-picker
                          v-model="formData.incidentDate"
                          color="#E2E2F3"
                          @update:model-value="dateMenu = false"
                        />
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formData.incidentLocation"
                        label="Incident Location"
                        outlined
                        dense
                        color="#000c66"
                        :disabled="formData.unknownLocation"
                        :rules="[(v) => !!v || 'Location is required']"
                        :error-messages="errors.incidentLocation"
                      />
                    </v-col>
                  </v-row>
                  <v-checkbox
                    v-model="formData.unknownLocation"
                    label="Unknown location"
                    color="#000c66"
                    class="mt-0"
                    @change="formData.incidentLocation = $event ? '' : formData.incidentLocation"
                  />
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
                        "
                      >
                        Submit Report
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
        anonymous: false,
        crimeType: null,
        incidentDate: null,
        incidentLocation: '',
        unknownLocation: false,
        description: '',
        attachments: [],
        witnessName: '',
        witnessContact: '',
        allowContact: false,
        consent: false,
      },
      errors: {},
      crimeTypes: ['Theft', 'Vandalism', 'Harassment', 'Fraud', 'Other'],
      dateMenu: false,
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
      if (!this.formData.anonymous) {
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
        if (!this.formData.phone.trim()) {
          this.errors.phone = 'Phone number is required'
          isValid = false
        }
      }
      if (!this.formData.crimeType) {
        this.errors.crimeType = 'Crime type is required'
        isValid = false
      }
      if (!this.formData.incidentDate) {
        this.errors.incidentDate = 'Incident date is required'
        isValid = false
      }
      if (!this.formData.incidentLocation && !this.formData.unknownLocation) {
        this.errors.incidentLocation = 'Incident location is required'
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
    handleSubmit() {
      if (this.validateForm()) {
        console.log('Report data:', this.formData)
        this.$router.push('/confirmation')
      }
    },
  },
}
</script>

<style scoped>
.full-screen-container {
  --spacer: 1.5rem;
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
</style>
