<template>
  <v-app style="background: #e2e2f3">
    <v-main>
      <v-container fluid class="pa-0" style="height: 100vh">
        <v-row no-gutters style="height: 100%">
          <!-- Left Column: Modern Buttons and Location Summary -->
          <v-col cols="12" md="6" class="pa-3 d-flex flex-column" style="background: #e2e2f3">
            <v-card
              flat
              class="pa-4 mb-3"
              style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 12, 102, 0.1)"
            >
              <!-- SOS Button -->
              <div class="button-overlay">
                <v-btn
                  fab
                  :class="{ vibrating: !dialog && !countdownActive }"
                  @click="startSOS"
                  style="
                    background-color: #ffffff;
                    border: 2px solid #e2e2f3;
                    width: 12.8vw;
                    height: 12.8vw;
                    border-radius: 50%;
                    z-index: 10;
                  "
                  elevation="24"
                >
                  <span style="color: #000c66; font-size: 2.048vw; font-weight: bold">SOS</span>
                </v-btn>
              </div>
            </v-card>

            <!-- Location Buttons -->
            <v-card
              flat
              class="pa-4 mb-3 d-flex justify-center"
              style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 12, 102, 0.1)"
            >
              <div class="card">
                <p @click="showLocation" :class="{ disabled: isTracking }">
                  <span>
                    <div class="loader share-loader"></div>
                    Share Location
                  </span>
                </p>
                <p @click="stopTracking" :class="{ disabled: !isTracking }">
                  <span>
                    <div class="loader stop-loader"></div>
                    Stop Sharing
                  </span>
                </p>
              </div>
            </v-card>

            <!-- Location Summary of Others -->
            <v-card
              flat
              class="pa-4 flex-grow-1"
              style="
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 12, 102, 0.1);
                overflow: hidden;
              "
            >
              <h3 class="summary-title">Nearby Users</h3>
              <v-divider class="mb-2" style="border-color: #000c66"></v-divider>
              <v-list dense class="user-list">
                <v-list-item
                  v-for="(user, index) in otherUsers"
                  :key="index"
                  class="user-item"
                  @click="showUserOnMap(user)"
                >
                  <v-list-item-content>
                    <v-list-item-title :class="'user-name'">{{ user.name }}</v-list-item-title>
                    <v-list-item-subtitle :class="'user-coords'">
                      Lat: {{ user.lat.toFixed(4) }}, Lon: {{ user.lon.toFixed(4) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon small color="#000C66">mdi-map-marker-radius</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- Right Column: Map -->
          <v-col cols="12" md="6" class="pa-0">
            <div id="map-container" style="height: 100%"></div>
          </v-col>
        </v-row>

        <!-- Countdown Overlay -->
        <v-dialog v-model="countdownActive" fullscreen hide-overlay transition="fade-transition">
          <v-card color="#ff4444" class="countdown-overlay">
            <div class="countdown-content">
              <div class="countdown-number">{{ countdown }}</div>
              <div class="countdown-text">Emergency call in progress</div>
              <v-btn
                @click="cancelCountdown"
                large
                class="countdown-cancel"
                color="#000C66"
                text
                elevation="12"
              >
                CANCEL
              </v-btn>
            </div>
          </v-card>
        </v-dialog>

        <!-- Contact Dialog -->
        <v-dialog v-model="dialog" max-width="400" persistent>
          <v-card flat style="border-radius: 12px">
            <v-card-title class="text-h5" style="color: #000c66; padding: 16px">
              Emergency Services
            </v-card-title>
            <v-card-text style="padding: 16px">
              <v-btn block class="mb-2" color="#E2E2F3" @click="contactService('Police')">
                Police
              </v-btn>
              <v-btn block class="mb-2" color="#E2E2F3" @click="contactService('Ambulance')">
                Ambulance
              </v-btn>
              <v-btn block class="mb-2" color="#E2E2F3" @click="contactService('Fire Service')">
                Fire Services
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <div class="contacts-header">Trusted Circles</div>
              <div class="contacts-list">
                <div
                  v-for="(contact, index) in trustedContacts"
                  :key="'contact-' + index"
                  class="contact-item"
                  @click="contactService(contact.name)"
                >
                  <v-avatar size="40" class="contact-avatar">
                    <img :src="contact.photo" :alt="contact.name" />
                  </v-avatar>
                  <div class="contact-details">
                    <div class="contact-name">{{ contact.name }}</div>
                    <div class="contact-status" :class="'status-' + contact.status">
                      {{ contact.status }}
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
            <v-card-actions style="padding: 16px">
              <v-spacer></v-spacer>
              <v-btn color="#000C66" text @click="cancelDialog">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'SafetyApp',
  setup() {
    const map = ref(null)
    const userMarker = ref(null)
    const isTracking = ref(false)
    const otherUsers = ref([
      { name: 'Alice', lat: 51.51, lon: -0.08 },
      { name: 'Bob', lat: 51.5, lon: -0.1 },
      { name: 'Charlie', lat: 51.49, lon: -0.09 },
    ])
    const dialog = ref(false)
    const countdownActive = ref(false)
    const countdown = ref(5)
    let countdownInterval = null
    let userMarkers = []
    const trustedContacts = ref([
      {
        name: 'John Doe',
        photo: 'https://randomuser.me/api/portraits/men/1.jpg',
        status: 'Available',
        phone: '+1234567890',
      },
      {
        name: 'Jane Smith',
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
        status: 'Notified',
        phone: '+1987654321',
      },
      {
        name: 'Family Group',
        photo: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
        status: 'Responding',
        phone: '+1122334455',
      },
    ])

    // Initialize map
    onMounted(() => {
      map.value = L.map('map-container', {
        zoomControl: false,
        attributionControl: false,
      }).setView([51.505, -0.09], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        className: 'map-tiles',
      }).addTo(map.value)

      const mapContainer = document.getElementById('map-container')
      mapContainer.style.borderLeft = '1px solid #E2E2F3'
    })

    // Show user's location
    const showLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            map.value.setView([latitude, longitude], 15)
            userMarker.value = L.marker([latitude, longitude])
              .addTo(map.value)
              .bindPopup('You are here!')
              .openPopup()
            isTracking.value = true
          },
          (error) => {
            alert('Unable to retrieve location: ' + error.message)
          },
        )
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    }

    // Stop tracking and remove marker
    const stopTracking = () => {
      if (userMarker.value) {
        map.value.removeLayer(userMarker.value)
        userMarker.value = null
        isTracking.value = false
      }
    }

    // Show other user's location on map
    const showUserOnMap = (user) => {
      userMarkers.forEach((marker) => map.value.removeLayer(marker))
      userMarkers = []
      const marker = L.marker([user.lat, user.lon])
        .addTo(map.value)
        .bindPopup(`${user.name}'s Location`)
        .openPopup()
      map.value.setView([user.lat, user.lon], 15)
      userMarkers.push(marker)
    }

    // SOS Button actions
    const startSOS = () => {
      dialog.value = true // Show emergency contacts dialog immediately
    }

    const startCountdown = () => {
      countdownActive.value = true
      countdown.value = 5
      countdownInterval = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(countdownInterval)
          countdownActive.value = false
          console.log('Emergency call initiated!')
        }
      }, 1000)
    }

    const cancelCountdown = () => {
      clearInterval(countdownInterval)
      countdownActive.value = false
    }

    const contactService = (service) => {
      console.log(`Contacting ${service}...`)
      dialog.value = false // Close dialog
      startCountdown() // Start countdown immediately
      if (service === 'Trusted Circles') {
        notifyTrustedContacts()
      }
    }

    const notifyTrustedContacts = () => {
      trustedContacts.value = trustedContacts.value.map((contact) => ({
        ...contact,
        status: ['Notified', 'Responding', 'Available'][Math.floor(Math.random() * 3)],
      }))
      console.log('Notifying all trusted contacts')
    }

    // Handle dialog cancellation
    const cancelDialog = () => {
      dialog.value = false
      startCountdown() // Start countdown even if dialog is cancelled
    }

    // Cleanup
    const cleanup = () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }

    return {
      showLocation,
      stopTracking,
      showUserOnMap,
      otherUsers,
      isTracking,
      startSOS,
      cancelCountdown,
      contactService,
      dialog,
      countdownActive,
      countdown,
      trustedContacts,
      cleanup,
      cancelDialog,
    }
  },
  beforeUnmount() {
    this.cleanup()
  },
}
</script>

<style scoped>
.map-tiles {
  filter: brightness(0.98) contrast(1.05);
}

#map-container {
  background: white;
}

/* SOS Button */
.button-overlay {
  display: flex;
  justify-content: center;
}

.vibrating {
  animation: vibrate 0.5s infinite;
}

@keyframes vibrate {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-4px, 4px);
  }
  40% {
    transform: translate(-4px, -4px);
  }
  60% {
    transform: translate(4px, 4px);
  }
  80% {
    transform: translate(4px, -4px);
  }
  100% {
    transform: translate(0);
  }
}

/* Countdown Overlay Styles */
.countdown-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.countdown-content {
  text-align: center;
  color: white;
}

.countdown-number {
  font-size: 120px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 20px;
}

.countdown-text {
  font-size: 24px;
  margin-bottom: 40px;
}

.countdown-cancel {
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
}

/* Contacts Panel Styles */
.contacts-header {
  font-weight: bold;
  margin: 15px 0 10px;
  color: #000c66;
}

.contacts-list {
  margin-top: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.contact-item:hover {
  background-color: #e2e2f3;
}

.contact-details {
  margin-left: 15px;
}

.contact-name {
  font-weight: 500;
  color: #000c66;
}

.contact-status {
  font-size: 12px;
  color: #666;
}

.status-Notified {
  color: #ff9800;
}

.status-Responding {
  color: #4caf50;
}

.status-Available {
  color: #000c66;
}

/* Location Summary */
.summary-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #000c66;
}

.user-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
}

.user-item {
  border-radius: 8px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.user-item:hover {
  background: #e2e2f3;
}

.user-name {
  font-size: 1rem;
  font-weight: 500;
  color: #000c66;
}

.user-coords {
  font-size: 0.85rem;
  color: #666;
}

/* Scrollbar Styling */
.user-list::-webkit-scrollbar {
  width: 6px;
}

.user-list::-webkit-scrollbar-track {
  background: #e2e2f3;
}

.user-list::-webkit-scrollbar-thumb {
  background: #000c66;
  border-radius: 3px;
}

/* Card Styles */
.card {
  width: 100%;
  height: 140px;
  background: #e2e2f3;
  display: flex;
  gap: 5px;
  padding: 0.4em;
  border-radius: 4px;
  border: 1px solid #000c66;
}

.card p {
  height: 100%;
  flex: 1;
  overflow: hidden;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.5s;
  background: #e2e2f3;
  border: 1px solid #000c66;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card p:hover {
  flex: 4;
}

.card p.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.card p span {
  min-width: 10em;
  padding: 0.5em;
  text-align: center;
  transform: rotate(0deg);
  transition: all 0.5s;
  text-transform: uppercase;
  color: #000c66;
  letter-spacing: 0.1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.card p:hover span {
  transform: rotate(-90deg);
}

/* Loader Button Styles */
.loader {
  width: 36px;
  height: 36px;
  position: relative;
  transform: rotate(45deg);
}

.loader:before,
.loader:after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50% 50% 0 50%;
  background: #0000;
  background-image: radial-gradient(circle 9px at 50% 50%, #0000 94%, #000c66);
}

.loader:after {
  animation: pulse-ytk0dhmd 1s infinite;
  transform: perspective(336px) translateZ(0px);
}

@keyframes pulse-ytk0dhmd {
  to {
    transform: perspective(336px) translateZ(168px);
    opacity: 0;
  }
}

/* Slashed Effect for Stop Sharing */
.stop-loader {
  position: relative;
}

.stop-loader:before {
  content: '';
  position: absolute;
  top: 50%;
  left: -10%;
  width: 120%;
  height: 4px;
  background: #ff4444;
  transform: rotate(-45deg);
  z-index: 10;
}

/* Responsive Design */
@media (max-width: 960px) {
  .pa-3 {
    padding: 12px !important;
  }

  .summary-title {
    font-size: 1.1rem;
  }

  .user-list {
    max-height: 300px;
  }

  .button-overlay .v-btn {
    width: 25vw;
    height: 25vw;
  }

  .button-overlay .v-btn span {
    font-size: 4vw;
  }

  .countdown-number {
    font-size: 80px;
  }

  .countdown-text {
    font-size: 18px;
  }

  .card {
    width: 100%;
    height: 126px;
  }

  .loader {
    width: 30px;
    height: 30px;
  }

  .card p span {
    min-width: 8em;
    font-size: 0.8rem;
    gap: 15px;
  }
}
</style>
