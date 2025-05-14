<template>
  <v-app style="background: #e2e2f3">
    <v-main>
      <v-container fluid class="pa-0" style="height: 100vh">
        <v-row no-gutters style="height: 100%">
          <!-- Left Column with Buttons -->
          <v-col class="pa-3 d-flex flex-column justify-center align-center left-column">
            <v-card
              flat
              class="pa-4"
              style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 12, 102, 0.1)"
            >
              <div class="card">
                <p @click="showLocation" :class="{ disabled: isTracking }">
                  <span>
                    <div class="loader share-loader"></div>
                    Share
                  </span>
                </p>
                <p @click="stopTracking" :class="{ disabled: !isTracking }">
                  <span>
                    <div class="loader stop-loader"></div>
                    Stop
                  </span>
                </p>
              </div>
            </v-card>
          </v-col>

          <!-- Right Column with Leaflet Map -->
          <v-col class="pa-0 map-column">
            <l-map
              class="leaflet-map"
              :zoom="zoom"
              :center="center"
              :minZoom="6.5"
              :maxZoom="16"
              :maxBounds="bounds"
              :options="{ zoomControl: false }"
              :bounds="bounds"
              @ready="onLeafletReady"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
              />
              <l-control-layers position="topright" />
              <l-marker v-if="userLatLng" :lat-lng="userLatLng" :icon="userIcon">
                <l-popup>You are here!</l-popup>
              </l-marker>
            </l-map>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LControlLayers } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'SOS',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LControlLayers,
  },
  data() {
    return {
      zoom: 11,
      center: [-1.309, 36.814], // Nairobi center
      bounds: [
        [-4.8995, 33.9098],
        [4.62, 41.8995],
      ],
      userLatLng: null,
      isTracking: false,
    }
  },
  computed: {
    userIcon() {
      return new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
      })
    },
  },
  methods: {
    showLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            this.center = [latitude, longitude]
            this.userLatLng = [latitude, longitude]
            this.isTracking = true
          },
          (err) => alert('Location error: ' + err.message),
        )
      } else {
        alert('Geolocation not supported.')
      }
    },
    stopTracking() {
      this.userLatLng = null
      this.isTracking = false
    },
    onLeafletReady() {
      console.log('Leaflet map is ready')
    },
  },
}
</script>

<style scoped>
.left-column {
  width: 40%;
  max-width: 40%;
  background: #e2e2f3;
}

.map-column {
  width: 60%;
  max-width: 60%;
  height: 100%;
}

.leaflet-map {
  height: 100%;
  width: 100%;
}

.card {
  width: 100%;
  height: 140px;
  background: #ffffff;
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
  background: #ffffff;
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
  color: #000000;
  letter-spacing: 0.1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.card p:hover span {
  transform: rotate(-90deg);
}

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
  background-image: radial-gradient(circle 9px at 50% 50%, #0000 94%, #ff4444);
}

.loader:after {
  animation: pulse 1s infinite;
  transform: perspective(336px) translateZ(0px);
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

@keyframes pulse {
  to {
    transform: perspective(336px) translateZ(168px);
    opacity: 0;
  }
}

@media (max-width: 960px) {
  .left-column {
    width: 100%;
    max-width: 100%;
    height: auto;
  }

  .map-column {
    width: 100%;
    max-width: 100%;
    height: 400px;
  }

  .card {
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
