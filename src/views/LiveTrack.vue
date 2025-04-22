<template>
  <v-app style="background: #f5f5f5">
    <v-main>
      <v-container fluid class="pa-0" style="height: 100vh">
        <v-row no-gutters style="height: 100%">
          <!-- Left Column: Modern Buttons and Location Summary -->
          <v-col cols="12" md="6" class="pa-3 d-flex flex-column" style="background: #fafafa">
            <v-card
              flat
              class="pa-4 mb-3"
              style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"
            >
              <!-- Panic Button -->
              <v-btn block large class="panic-btn" @click="triggerPanic">
                <v-icon left>mdi-alert</v-icon>
                PANIC
              </v-btn>
            </v-card>

            <!-- Location Buttons -->
            <v-card
              flat
              class="pa-4 mb-3 d-flex justify-center"
              style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    color="#1976d2"
                    dark
                    class="mr-2 location-btn"
                    @click="showLocation"
                    :disabled="isTracking"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-map-marker</v-icon>
                  </v-btn>
                </template>
                <span>Show My Location</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    color="#d81b60"
                    dark
                    class="location-btn"
                    @click="stopTracking"
                    :disabled="!isTracking"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-stop</v-icon>
                  </v-btn>
                </template>
                <span>Stop Tracking</span>
              </v-tooltip>
            </v-card>

            <!-- Location Summary of Others -->
            <v-card
              flat
              class="pa-4 flex-grow-1"
              style="
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                overflow: hidden;
              "
            >
              <h3 class="summary-title">Nearby Users</h3>
              <v-divider class="mb-2" style="border-color: #8593ff"></v-divider>
              <v-list dense class="user-list">
                <v-list-item
                  v-for="(user, index) in otherUsers"
                  :key="index"
                  class="user-item"
                  @click="showUserOnMap(user)"
                >
                  <v-list-item-content>
                    <v-list-item-title class="user-name">{{ user.name }}</v-list-item-title>
                    <v-list-item-subtitle class="user-coords">
                      Lat: {{ user.lat.toFixed(4) }}, Lon: {{ user.lon.toFixed(4) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon small color="#1976d2">mdi-map-marker-radius</v-icon>
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
    let userMarkers = []

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
      mapContainer.style.borderLeft = '1px solid #eee'
    })

    // Panic Button action
    const triggerPanic = () => {
      alert('Emergency alert sent! Help is on the way.')
    }

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

    return {
      triggerPanic,
      showLocation,
      stopTracking,
      showUserOnMap,
      otherUsers,
      isTracking,
    }
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
.panic-btn {
  background: linear-gradient(45deg, #ff1744, #d81b60);
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.panic-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 23, 68, 0.3);
}

/* Location Buttons */
.location-btn {
  width: 48px;
  height: 48px;
  transition: transform 0.2s ease;
}

.location-btn:hover {
  transform: scale(1.1);
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
  background: #ebedff;
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
  background: #f0f0f0;
}

.user-list::-webkit-scrollbar-thumb {
  background: #8593ff;
  border-radius: 3px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .pa-3 {
    padding: 12px !important;
  }

  .panic-btn {
    font-size: 0.9rem;
  }

  .location-btn {
    width: 40px;
    height: 40px;
  }

  .summary-title {
    font-size: 1.1rem;
  }

  .user-list {
    max-height: 300px;
  }
}
</style>
