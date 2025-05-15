<template>
  <div style="position: relative; height: 100vh; overflow: hidden">
    <!-- Wavy Background -->
    <div class="wavy-background">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 40"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-24 88-24s58 24 88 24 58-24 88-24 58 24 88 24 v44h-352z"
          />
        </defs>
        <g class="parallax">
          <use
            v-for="(wave, index) in waves"
            :key="index"
            :xlink:href="'#gentle-wave'"
            :class="`wave-${index + 1}`"
            x="0"
            y="0"
            :fill="wave.color"
            :fill-opacity="wave.opacity"
          />
        </g>
      </svg>
    </div>

    <!-- Header Icon -->
    <div class="header-overlay">
      <img src="../assets/header.png" alt="Header Icon" class="header-icon" />
    </div>

    <!-- Panic Button -->
    <div class="button-overlay">
      <v-btn
        fab
        @click="showDialog"
        style="
          background-color: #ffffff;
          border: 2px solid #f5f5f5;
          width: 12.8vw;
          height: 12.8vw;
          border-radius: 50%;
          z-index: 10;
        "
        elevation="24"
      >
        <span style="color: #333333; font-size: 2.048vw; font-weight: bold">SOS</span>
      </v-btn>
    </div>

    <!-- Emergency Services Dialog -->
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h5" style="color: #333333; padding: 16px">
          Emergency Services
        </v-card-title>
        <v-card-text style="padding: 16px">
          <v-btn block class="mb-2" color="#e0e0e0" @click="selectService('police')">Police</v-btn>
          <v-btn block class="mb-2" color="#e0e0e0" @click="selectService('ambulance')"
            >Ambulance</v-btn
          >
          <v-btn block class="mb-2" color="#e0e0e0" @click="selectService('fire_services')"
            >Fire Services</v-btn
          >
        </v-card-text>
        <v-card-actions style="padding: 16px">
          <v-spacer></v-spacer>
          <v-btn color="#333333" text @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Description Dialog -->
    <v-dialog v-model="descriptionDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h5" style="color: #333333; padding: 16px">
          Describe the Emergency
        </v-card-title>
        <v-card-text style="padding: 16px">
          <v-textarea
            v-model="description"
            label="Brief description of the emergency"
            rows="4"
            outlined
            :rules="[(v) => !!v || 'Description is required']"
          ></v-textarea>
        </v-card-text>
        <v-card-actions style="padding: 16px">
          <v-spacer></v-spacer>
          <v-btn color="#333333" text @click="descriptionDialog = false">Cancel</v-btn>
          <v-btn color="#000C66" :disabled="!description" @click="startCountdown" elevation="4"
            >Send SOS</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Countdown Overlay -->
    <v-dialog v-model="countdownActive" fullscreen hide-overlay transition="fade-transition">
      <v-card color="#ff4444" class="countdown-overlay">
        <div class="countdown-content">
          <div class="countdown-number">{{ countdown }}</div>
          <div class="countdown-text">Contacting {{ selectedService }}...</div>
          <v-btn
            @click="cancelCountdown"
            large
            dark
            class="countdown-cancel"
            color="#000C66"
            variant="text"
            elevation="12"
          >
            CANCEL
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Success/Error Notification -->
    <v-snackbar v-model="alert.show" :color="alert.color" timeout="3000">
      {{ alert.message }}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EmergencyButton',
  data() {
    return {
      dialog: false,
      descriptionDialog: false,
      countdownActive: false,
      countdown: 3,
      countdownInterval: null,
      selectedService: '',
      description: '',
      waves: [
        { color: '#E2E2F3', opacity: 0.7 },
        { color: '#E2E2F3', opacity: 0.5 },
        { color: '#E2E2F3', opacity: 0.3 },
        { color: '#E2E2F3', opacity: 0.1 },
      ],
      alert: {
        show: false,
        message: '',
        color: 'success',
      },
    }
  },
  methods: {
    showDialog() {
      this.dialog = true
    },
    selectService(service) {
      this.selectedService = this.formatServiceName(service)
      this.dialog = false
      this.descriptionDialog = true
      this.description = ''
    },
    startCountdown() {
      this.descriptionDialog = false
      this.countdownActive = true
      this.countdown = 3

      this.countdownInterval = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval)
          this.sendEmergencyRequest()
        }
      }, 1000)
    },
    cancelCountdown() {
      clearInterval(this.countdownInterval)
      this.countdownActive = false
      this.showAlert('Emergency call cancelled', 'info')
    },
    formatServiceName(service) {
      const names = {
        police: 'Police',
        ambulance: 'Ambulance',
        fire_services: 'Fire Services',
      }
      return names[service] || service
    },
    async sendEmergencyRequest() {
      this.countdownActive = false

      try {
        const position = await this.getCurrentPosition()
        const { latitude, longitude } = position.coords
        //made change
        const authToken = localStorage.getItem('authToken')

        if (!authToken) throw new Error('Authorization token is missing.')

        const payload = {
          sos_type: this.selectedService.toLowerCase().replace(' ', '_'),
          description: this.description,
          latitude,
          longitude,
        }

        console.log('Sending SOS:', {
          url: 'http://localhost:8000/api/sos',
          authToken,
          payload,
        })

        const response = await axios.post('http://localhost:8000/api/sos', payload, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        console.log('SOS Response:', response.data)
        this.showAlert(`${this.selectedService} has been notified! Help is on the way.`, 'success')
      } catch (error) {
        console.error('Error sending emergency request:', error)

        let errorMessage = 'Failed to send emergency request. Please try again.'

        if (error.message.includes('Geolocation')) {
          errorMessage = 'Location access denied. Please enable location services and try again.'
        } else if (error.response) {
          errorMessage = `Server error (${error.response.status}): ${error.response.data.message || 'Internal error'}`
          console.error('Server response:', error.response.data)
        }

        this.showAlert(errorMessage, 'error')
      }
    },
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'))
        } else {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (err) => {
              console.error('Geolocation error:', err)
              reject(new Error('Unable to get location. Please check GPS or permissions.'))
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            },
          )
        }
      })
    },
    showAlert(message, color) {
      console.log(`ALERT (${color}):`, message)
      this.alert = { show: true, message, color }
    },
  },
  beforeDestroy() {
    if (this.countdownInterval) clearInterval(this.countdownInterval)
  },
}
</script>

<style scoped>
/* Your existing styles are already clean and responsive. Keeping as-is */
.wavy-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}
.waves {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
}
.header-overlay {
  position: fixed;
  top: 5vw;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  justify-content: center;
}
.button-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  justify-content: center;
}
.header-icon {
  width: 11vw;
}
.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
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
@media (max-width: 768px) {
  .waves {
    height: 100%;
  }
  .button-overlay .v-btn {
    width: 25vw;
    height: 25vw;
  }
  .button-overlay .v-btn span {
    font-size: 4vw;
  }
  .header-icon {
    width: 20vw;
  }
  .header-overlay {
    top: 4vw;
  }
  .countdown-number {
    font-size: 80px;
  }
  .countdown-text {
    font-size: 18px;
  }
}
</style>
