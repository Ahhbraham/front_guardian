<template>
  <v-app style="background: #e2e2f3">
    <v-main>
      <v-container fluid class="pa-0" style="height: 100vh">
        <v-row no-gutters style="height: 100%">
          <!-- Left Column -->
          <v-col cols="12" md="6" class="pa-3 d-flex flex-column" style="background: #e2e2f3">
            <!-- Placeholder Card -->
            <v-card
              flat
              class="pa-4 mb-3"
              style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 12, 102, 0.1)"
            >
              <div class="placeholder-content">
                <h3 class="placeholder-title">Safety Dashboard</h3>
                <p class="placeholder-text">Monitor your safety features here.</p>
              </div>
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
  name: 'SafetyDashboard',
  setup() {
    const map = ref(null)

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

    return {
      map,
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

/* Placeholder Content */
.placeholder-content {
  text-align: center;
}

.placeholder-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #000c66;
}

.placeholder-text {
  font-size: 0.9rem;
  color: #666;
}

/* Responsive Design */
@media (max-width: 960px) {
  .pa-3 {
    padding: 12px !important;
  }

  .placeholder-title {
    font-size: 1.1rem;
  }

  .placeholder-text {
    font-size: 0.85rem;
  }
}
</style>
