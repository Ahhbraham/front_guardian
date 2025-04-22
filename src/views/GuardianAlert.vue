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
            d="M-160 44c30 0 58-24 88-24s 58 24 88 24 58-24 88-24 58 24 88 24 v44h-352z"
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
        :class="{ vibrating: !dialog }"
        @click="showDialog"
        style="
          background-color: #ffffff;
          border: 2px solid #f5f5f5;
          width: 12.8vw;
          height: 12.8vw;
          border-radius: 50%;
        "
        elevation="24"
      >
        <span style="color: #333333; font-size: 2.048vw; font-weight: bold">SOS</span>
      </v-btn>
    </div>

    <!-- Contact Dialog -->
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card color="#ffffff">
        <v-card-title class="text-h5" style="color: #333333"> Emergency</v-card-title>
        <v-card-text>
          <v-btn block class="mb-2" color="#f5f5f5" dark @click="contactService('Police')">
            Police
          </v-btn>
          <v-btn block class="mb-2" color="#f5f5f5" dark @click="contactService('Ambulance')">
            Ambulance
          </v-btn>
          <v-btn block class="mb-2" color="#f5f5f5" dark @click="contactService('Fire Service')">
            Fire Services
          </v-btn>
          <v-btn block color="#f5f5f5" dark @click="contactService('Trusted Circles')">
            Trusted Circles
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#333333" text @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'PanicButtonWithWaves',
  data() {
    return {
      dialog: false,
      waves: [
        { color: '#E2E2F3', opacity: 0.7 },
        { color: '#E2E2F3', opacity: 0.5 },
        { color: '#E2E2F3', opacity: 0.3 },
        { color: '#E2E2F3', opacity: 0.1 },
      ],
    }
  },
  methods: {
    showDialog() {
      this.dialog = true
    },
    contactService(service) {
      console.log(`Contacting ${service}...`)
      alert(`Contacting ${service}`)
      this.dialog = false
    },
  },
}
</script>

<style scoped>
/* Wavy Background Styles */
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

/* Header Overlay */
.header-overlay {
  position: fixed;
  top: 5vw;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  justify-content: center;
}

/* Button Overlay */
.button-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  justify-content: center;
}

/* Header Icon */
.header-icon {
  width: 11vw;
}

/* Animation */
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

/* Vibrating button animation */
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

/* Dark text for dialog and buttons */
.v-card-title,
.v-btn {
  color: #333333 !important;
}

/* Button hover effect */
.v-btn:hover {
  background-color: #e0e0e0 !important;
}

/* Mobile adjustments */
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
}
</style>
