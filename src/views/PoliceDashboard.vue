<template>
  <v-app>
    <v-main class="federal-blue">
      <v-row justify="center" class="mb-6">
        <v-col cols="12" sm="6" md="4" class="text-center">
          <img
            src="../assets/header.png"
            style="max-height: 120px; max-width: 360px"
            class="mx-auto"
          />
        </v-col>
      </v-row>

      <v-progress-linear
        v-if="isLoading"
        indeterminate
        color="#E2E2F3"
        class="mb-4 mx-auto"
        style="max-width: 600px"
      ></v-progress-linear>
      <v-alert v-if="error" type="error" class="mb-4 mx-auto" style="max-width: 600px">
        {{ error }}
      </v-alert>

      <v-row justify="center" v-if="reports.length">
        <v-col cols="12" md="10" lg="8" xl="8">
          <div class="reports-grid">
            <div
              v-for="(report, index) in sortedReports"
              :key="report.id || index"
              class="flip-card"
            >
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <div class="title">{{ report.first_name }} {{ report.last_name }}</div>
                  <p>{{ report.crime_type }}</p>
                  <p>{{ formatDate(report.incident_date) }}</p>
                </div>
                <div class="flip-card-back">
                  <div class="report-details">
                    <p><strong>Report ID:</strong> {{ report.id }}</p>
                    <p><strong>Submitted:</strong> {{ formatDateTime(report.created_at) }}</p>
                    <p><strong>Email:</strong> {{ report.email }}</p>
                    <p><strong>Phone:</strong> {{ report.phone }}</p>
                    <p><strong>Address:</strong> {{ report.address || 'N/A' }}</p>
                    <p><strong>Incident Date:</strong> {{ formatDate(report.incident_date) }}</p>
                    <p><strong>Incident Location:</strong> {{ report.incident_location }}</p>
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

                    <div v-if="report.attachments && report.attachments.length" class="mt-4">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-alert
        v-else-if="!isLoading && !error"
        type="info"
        class="mt-4 mx-auto"
        style="max-width: 600px"
      >
        No reports found.
      </v-alert>
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
    }
  },
  computed: {
    sortedReports() {
      return [...this.reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
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
        if (response.data.success) {
          this.reports = response.data.data.map((report) => ({
            ...report,
            witnessName: report.witness_name || report.witnessName,
            witnessContact: report.witness_contact || report.witnessContact,
            allowContact: report.allow_contact || report.allowContact,
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
.federal-blue {
  background-color: #000c66;
  min-height: 100vh;
  padding: 24px;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 20px;
}

.flip-card {
  background-color: transparent;
  width: 300px;
  height: 400px;
  perspective: 1000px;
  font-family: sans-serif;
  margin: 0 auto;
}

.title {
  font-size: 2em;
  font-weight: 900;
  text-align: center;
  margin: 0 0 10px 0;
  color: #000c66;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border: 1px solid #d5d5e9;
  border-radius: 1rem;
  padding: 20px;
  box-sizing: border-box;
}

.flip-card-front {
  background-color: #e2e2f3;
  color: #000c66;
}

.flip-card-back {
  background-color: #d5d5e9;
  color: #000c66;
  transform: rotateY(180deg);
  overflow-y: auto;
}

.report-details {
  text-align: left;
  font-size: 0.9em;
}

.report-details p {
  margin: 5px 0;
}

.attachment-list {
  padding-left: 20px;
  margin-top: 8px;
  list-style-type: none;
}

.attachment-link {
  color: #000c66;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color 0.3s;
}

.attachment-link:hover {
  color: #333;
  text-decoration: underline;
}
</style>
