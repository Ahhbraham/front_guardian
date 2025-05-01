<template>
  <v-app style="background: #e2e2f3">
    <v-main>
      <v-container fluid class="pa-0" style="height: 100vh">
        <v-row no-gutters style="height: 100%">
          <!-- Left Column: Panic Button and Zonal Updates -->
          <v-col cols="12" md="6" class="pa-3 d-flex flex-column" style="background: #e2e2f3">
            <!-- Panic Button -->
            <v-card
              flat
              class="pa-4 mb-3"
              style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 12, 102, 0.1)"
            >
              <div class="button-overlay">
                <v-btn
                  fab
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

            <!-- Zonal Safety Updates -->
            <v-card
              flat
              class="pa-4 flex-grow-1"
              style="
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 12, 102, 0.1);
                overflow: hidden;
              "
            >
              <h3 class="summary-title">Zonal Safety Updates</h3>
              <v-divider class="mb-2" style="border-color: #000c66"></v-divider>
              <v-list dense class="zone-list">
                <v-list-item
                  v-for="(zone, index) in zones"
                  :key="index"
                  class="zone-item"
                  @click="showZoneOnMap(zone)"
                >
                  <v-list-item-content>
                    <v-list-item-title :class="'zone-name'">{{ zone.name }}</v-list-item-title>
                    <v-list-item-subtitle :class="'zone-safety'">
                      Safety: {{ zone.safetyRating }} | {{ zone.riskLevel }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle :class="'zone-comment'">
                      {{ zone.comment }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon small :color="zone.color">mdi-map-marker</v-icon>
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
              <div class="contacts-header">Trusted Contacts</div>
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
              <v-btn color="#000c66" text @click="cancelDialog">Cancel</v-btn>
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
  name: 'ZonalSafetyUpdates',
  setup() {
    const map = ref(null)
    const zonePolygons = ref([])
    const dialog = ref(false)
    const countdownActive = ref(false)
    const countdown = ref(5)
    let countdownInterval = null
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
    const zones = ref([
      {
        name: 'Downtown',
        lat: 51.505,
        lon: -0.09,
        safetyRating: 'Moderate',
        riskLevel: 'Medium Risk',
        comment: 'Recent increase in petty theft reported.',
        color: '#FFA500',
        coordinates: [
          [51.506, -0.092],
          [51.506, -0.088],
          [51.504, -0.088],
          [51.504, -0.092],
        ],
      },
      {
        name: 'Suburbs',
        lat: 51.51,
        lon: -0.08,
        safetyRating: 'Safe',
        riskLevel: 'Low Risk',
        comment: 'Quiet residential area with minimal incidents.',
        color: '#008000',
        coordinates: [
          [51.512, -0.082],
          [51.512, -0.078],
          [51.508, -0.078],
          [51.508, -0.082],
        ],
      },
      {
        name: 'Industrial Zone',
        lat: 51.49,
        lon: -0.1,
        safetyRating: 'Unsafe',
        riskLevel: 'High Risk',
        comment: 'Frequent vandalism and security concerns.',
        color: '#FF0000',
        coordinates: [
          [51.492, -0.102],
          [51.492, -0.098],
          [51.488, -0.098],
          [51.488, -0.102],
        ],
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

      // Add zone polygons to map
      zones.value.forEach((zone) => {
        const polygon = L.polygon(zone.coordinates, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.4,
        })
          .addTo(map.value)
          .bindPopup(
            `${zone.name}<br>Safety: ${zone.safetyRating}<br>Risk: ${zone.riskLevel}<br>${zone.comment}`,
          )
        zonePolygons.value.push(polygon)
      })
    })

    // Show zone on map
    const showZoneOnMap = (zone) => {
      zonePolygons.value.forEach((polygon) => {
        if (
          polygon.getBounds().getCenter().lat === zone.lat &&
          polygon.getBounds().getCenter().lng === zone.lon
        ) {
          map.value.setView([zone.lat, zone.lon], 15)
          polygon.openPopup()
        }
      })
    }

    // SOS Button actions
    const startSOS = () => {
      dialog.value = true
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
      dialog.value = false
      startCountdown()
      if (trustedContacts.value.some((contact) => contact.name === service)) {
        notifyTrustedContact(service)
      }
    }

    const notifyTrustedContact = (contactName) => {
      trustedContacts.value = trustedContacts.value.map((contact) => {
        if (contact.name === contactName) {
          return {
            ...contact,
            status: ['Notified', 'Responding', 'Available'][Math.floor(Math.random() * 3)],
          }
        }
        return contact
      })
      console.log(`Notifying ${contactName}`)
    }

    const cancelDialog = () => {
      dialog.value = false
    }

    // Cleanup
    const cleanup = () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }

    return {
      map,
      zones,
      showZoneOnMap,
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

/* Panic Button */
.button-overlay {
  display: flex;
  justify-content: center;
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

/* Zonal Updates */
.summary-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #000c66;
}

.zone-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
}

.zone-item {
  border-radius: 8px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.zone-item:hover {
  background: #e2e2f3;
}

.zone-name {
  font-size: 1rem;
  font-weight: 500;
  color: #000c66;
}

.zone-safety {
  font-size: 0.85rem;
  color: #666;
}

.zone-comment {
  font-size: 0.8rem;
  color: #888;
}

/* Scrollbar Styling */
.zone-list::-webkit-scrollbar {
  width: 6px;
}

.zone-list::-webkit-scrollbar-track {
  background: #e2e2f3;
}

.zone-list::-webkit-scrollbar-thumb {
  background: #000c66;
  border-radius: 3px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .pa-3 {
    padding: 12px !important;
  }

  .summary-title {
    font-size: 1.1rem;
  }

  .zone-list {
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
}
</style>
