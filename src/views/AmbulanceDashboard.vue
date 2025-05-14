<template>
  <v-app>
    <v-main class="federal-blue">
      <v-row no-gutters>
        <!-- Left Panel -->
        <v-col cols="12" md="6" class="left-panel">
          <v-row class="mb-6 justify-center">
            <v-col cols="12" class="text-center">
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

          <div v-if="reports.length" class="reports-grid ml-4">
            <div
              v-for="(report, index) in sortedReports"
              :key="report.id || index"
              class="flip-card"
            >
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <div class="title">{{ report.sos_type }}</div>
                  <p>{{ report.description || 'No description provided' }}</p>
                  <p>{{ formatDate(report.created_at) }}</p>
                </div>
                <div class="flip-card-back">
                  <div class="report-details">
                    <p><strong>Report ID:</strong> {{ report.id }}</p>
                    <p><strong>Service Type:</strong> {{ report.sos_type }}</p>
                    <p><strong>Submitted By:</strong> {{ report.user.name || 'Unknown' }}</p>
                    <p><strong>User Email:</strong> {{ report.user.email || 'N/A' }}</p>
                    <p>
                      <strong>Location:</strong>
                      <a href="#" @click.prevent="focusLocation(report.latitude, report.longitude)">
                        {{ formatCoordinates(report.latitude, report.longitude) }}
                      </a>
                    </p>
                    <p><strong>Description:</strong> {{ report.description || 'N/A' }}</p>
                    <p><strong>Report Date:</strong> {{ formatDateTime(report.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <v-alert
            v-else-if="!isLoading && !error"
            type="info"
            class="mt-4 ml-4"
            style="max-width: 600px"
          >
            No ambulance reports found.
          </v-alert>
        </v-col>

        <!-- Right Panel (Map) -->
        <v-col cols="12" md="6" class="right-panel">
          <div id="map" class="leaflet-map"></div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../services/api'

export default {
  name: 'AmbulanceDashboard',
  data() {
    return {
      reports: [],
      isLoading: false,
      error: null,
      map: null,
      marker: null,
    }
  },
  computed: {
    sortedReports() {
      return [...this.reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    },
  },
  mounted() {
    this.fetchReports()
    this.initMap()
  },
  methods: {
    async fetchReports() {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.get('/sos')
        if (response.data.success) {
          // Filter reports to only show ambulance services
          this.reports = response.data.data.filter((report) => report.sos_type === 'ambulance')
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

    initMap() {
      this.map = L.map('map').setView([1.2921, 36.8219], 6) // Default view set to Nairobi (Kenya)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map)

      // Setting bounds to Kenya's geographic limits
      const bounds = [
        [-4.9, 33.9], // Southwest corner
        [4.6, 41.9], // Northeast corner
      ]
      this.map.setMaxBounds(bounds) // Constrain the map within Kenya's bounds
    },

    focusLocation(lat, lng) {
      if (!this.map) return

      this.map.setView([lat, lng], 16)
      if (this.marker) this.map.removeLayer(this.marker)
      this.marker = L.marker([lat, lng]).addTo(this.map)
    },

    formatCoordinates(latitude, longitude) {
      return `Lat: ${latitude}, Long: ${longitude}`
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
@import 'leaflet/dist/leaflet.css';

.federal-blue {
  background-color: #000c66;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
}

.left-panel {
  padding: 24px 0;
}

.right-panel {
  background-color: #ffffff;
  height: 100vh; /* Ensure right panel occupies full height */
}

.leaflet-map {
  height: 100%; /* Ensure map takes full height of the parent container */
  width: 100%; /* Ensure map occupies full width */
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 0 10px 10px 10px;
}

.flip-card {
  background-color: transparent;
  width: 180px;
  height: 300px;
  perspective: 1000px;
  font-family: sans-serif;
}

.title {
  font-size: 1.2em;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
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
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
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
  padding: 12px;
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
  font-size: 0.8em;
}

.report-details p {
  margin: 4px 0;
}

.report-details a {
  color: #000c66;
  text-decoration: underline;
  cursor: pointer;
}
</style>
