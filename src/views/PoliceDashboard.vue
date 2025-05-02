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
            <h1 class="text-h4 mb-4 text-center">Police Report Dashboard</h1>
            <p class="mb-4 text-center">
              View all non-emergency crime reports submitted through the Guardian Alert system.
            </p>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8" xl="8">
            <v-card class="reports-container">
              <v-card-text>
                <v-progress-linear
                  v-if="isLoading"
                  indeterminate
                  color="#000c66"
                  class="mb-4"
                ></v-progress-linear>
                <v-alert v-if="error" type="error" class="mb-4">
                  {{ error }}
                </v-alert>
                <div v-if="reports.length">
                  <v-expansion-panels v-model="expandedPanels" multiple>
                    <v-expansion-panel
                      v-for="(report, index) in reports"
                      :key="report.id || index"
                      class="mb-2"
                    >
                      <v-expansion-panel-title>
                        <v-row no-gutters>
                          <v-col cols="6">
                            <strong>{{ report.first_name }} {{ report.last_name }}</strong>
                          </v-col>
                          <v-col cols="6" class="text-right">
                            {{ report.crime_type }} - {{ formatDate(report.incident_date) }}
                          </v-col>
                        </v-row>
                      </v-expansion-panel-title>
                      <v-expansion-panel-content>
                        <v-card flat>
                          <v-card-text>
                            <p><strong>Report ID:</strong> {{ report.id }}</p>
                            <p>
                              <strong>Submitted:</strong> {{ formatDateTime(report.created_at) }}
                            </p>
                            <p><strong>Email:</strong> {{ report.email }}</p>
                            <p><strong>Phone:</strong> {{ report.phone }}</p>
                            <p><strong>Address:</strong> {{ report.address || 'N/A' }}</p>
                            <p>
                              <strong>Incident Date:</strong> {{ formatDate(report.incident_date) }}
                            </p>
                            <p>
                              <strong>Incident Location:</strong> {{ report.incident_location }}
                            </p>
                            <p><strong>Description:</strong> {{ report.description }}</p>
                            <p>
                              <strong>Witness Name:</strong>
                              {{ report.witness_name || report.witnessName || 'N/A' }}
                            </p>
                            <p>
                              <strong>Witness Contact:</strong>
                              {{ report.witness_contact || report.witnessContact || 'N/A' }}
                            </p>
                            <p>
                              <strong>Allow Contact:</strong>
                              {{ report.allow_contact || report.allowContact ? 'Yes' : 'No' }}
                            </p>
                            <p><strong>Consent:</strong> {{ report.consent ? 'Yes' : 'No' }}</p>

                            <div v-if="report.attachments && report.attachments.length">
                              <strong>Attachments:</strong>
                              <ul class="attachment-list">
                                <li v-for="(attachment, idx) in report.attachments" :key="idx">
                                  <a
                                    :href="getAttachmentUrl(attachment)"
                                    target="_blank"
                                    class="attachment-link"
                                  >
                                    <v-icon small class="mr-1">mdi-paperclip</v-icon>
                                    {{ getAttachmentName(attachment) }}
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </div>
                <v-alert v-else-if="!isLoading && !error" type="info" class="mt-4">
                  No reports found.
                </v-alert>
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
  name: 'PoliceAbility',
  data() {
    return {
      reports: [],
      isLoading: false,
      error: null,
      expandedPanels: [],
    }
  },
  mounted() {
    this.fetchReports()
  },
  methods: {
    async fetchReports() {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get('/reports')
        console.log('API Response:', response)

        if (response.data.success) {
          this.reports = response.data.data.map((report) => ({
            ...report,
            // Ensure consistent field names
            witnessName: report.witness_name || report.witnessName,
            witnessContact: report.witness_contact || report.witnessContact,
            allowContact: report.allow_contact || report.allowContact,
            // Process attachments
            attachments: this.processAttachments(report.attachments),
          }))
        } else {
          this.error = response.data.message || 'Failed to fetch reports'
        }
      } catch (error) {
        console.error('Fetch Error:', error)
        if (error.response) {
          if (error.response.status === 401) {
            this.error = 'Unauthorized - Please login'
          } else if (error.response.status === 403) {
            this.error = 'Forbidden - You do not have permission'
          } else {
            this.error =
              error.response.data.message ||
              error.response.data.error ||
              `Error fetching reports (${error.response.status})`
          }
        } else if (error.request) {
          this.error = 'No response from server - Check your network connection'
        } else {
          this.error = 'Request error: ' + error.message
        }
      } finally {
        this.isLoading = false
      }
    },

    processAttachments(attachments) {
      if (!attachments) return []

      // Handle both string paths and object attachments
      if (typeof attachments === 'string') {
        try {
          attachments = JSON.parse(attachments)
        } catch (e) {
          return []
        }
      }

      return attachments.map((attachment) => {
        if (typeof attachment === 'string') {
          return {
            file_path: attachment,
            original_name: attachment.split('/').pop(),
          }
        }
        return attachment
      })
    },

    getAttachmentUrl(attachment) {
      if (attachment.url) return attachment.url
      if (attachment.file_path) {
        return `/storage/${attachment.file_path}`
      }
      return ''
    },

    getAttachmentName(attachment) {
      return (
        attachment.original_name ||
        attachment.name ||
        (attachment.file_path ? attachment.file_path.split('/').pop() : 'Attachment')
      )
    },

    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },

    formatDateTime(dateTime) {
      if (!dateTime) return 'N/A'
      return new Date(dateTime).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
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

.reports-container {
  width: 100%;
  max-width: 1200px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background: white;
}

.v-expansion-panel {
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
}

.v-expansion-panel-title {
  color: #000c66;
  font-weight: 600;
}

.text-h4 {
  color: #000c66;
  font-weight: 700;
}

.text-h5 {
  color: #000c66;
  font-weight: 600;
}

.attachment-list {
  padding-left: 20px;
  margin-top: 8px;
}

.attachment-link {
  color: #000c66;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color 0.3s;
}

.attachment-link:hover {
  color: #e85b04;
  text-decoration: underline;
}
</style>
