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

    <!-- Countdown Overlay -->
    <v-dialog v-model="countdownActive" fullscreen hide-overlay transition="fade-transition">
      <v-card color="#ff4444" class="countdown-overlay">
        <div class="countdown-content">
          <div class="countdown-number">{{ countdown }}</div>
          <div class="countdown-text">Emergency call in progress</div>
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

    <!-- Contact Dialog -->
    <v-dialog v-model="dialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h5" style="color: #333333; padding: 16px">
          Emergency Services
        </v-card-title>
        <v-card-text style="padding: 16px">
          <v-btn block class="mb-2" color="#e0e0e0" @click="startCountdown('Police')">
            Police
          </v-btn>
          <v-btn block class="mb-2" color="#e0e0e0" @click="startCountdown('Ambulance')">
            Ambulance
          </v-btn>
          <v-btn block class="mb-2" color="#e0e0e0" @click="startCountdown('Fire Service')">
            Fire Services
          </v-btn>
          <v-divider class="my-3"></v-divider>
          <div class="contacts-header">Trusted Contacts</div>
          <div class="contacts-list">
            <div
              v-for="(contact, index) in trustedContacts"
              :key="'contact-' + index"
              class="contact-item"
              @click="startCountdown(contact.name)"
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
          <v-btn color="#333333" text @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'EnhancedPanicButton',
  data() {
    return {
      dialog: false,
      countdownActive: false,
      countdown: 5,
      countdownInterval: null,
      selectedService: '',
      waves: [
        { color: '#E2E2F3', opacity: 0.7 },
        { color: '#E2E2F3', opacity: 0.5 },
        { color: '#E2E2F3', opacity: 0.3 },
        { color: '#E2E2F3', opacity: 0.1 },
      ],
      trustedContacts: [
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
      ],
    }
  },
  methods: {
    showDialog() {
      this.dialog = true
    },
    startCountdown(service) {
      this.selectedService = service
      this.dialog = false
      this.countdownActive = true
      this.countdown = 5
      this.countdownInterval = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval)
          this.countdownActive = false
          this.contactService(this.selectedService)
        }
      }, 1000)
    },
    cancelCountdown() {
      clearInterval(this.countdownInterval)
      this.countdownActive = false
    },
    contactService(service) {
      console.log(`Contacting ${service}...`)
      if (this.trustedContacts.some((contact) => contact.name === service)) {
        this.notifyTrustedContact(service)
      } else {
        alert(`Contacting ${service}`)
      }
    },
    notifyTrustedContact(contactName) {
      this.trustedContacts = this.trustedContacts.map((contact) => {
        if (contact.name === contactName) {
          return {
            ...contact,
            status: ['Notified', 'Responding', 'Available'][Math.floor(Math.random() * 3)],
          }
        }
        return contact
      })
      alert(`Notifying ${contactName}`)
    },
  },
  beforeDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
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
  color: #333;
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
  background-color: #f0f0f0;
}

.contact-details {
  margin-left: 15px;
}

.contact-name {
  font-weight: 500;
  color: #333;
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
  color: #2196f3;
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
  .countdown-number {
    font-size: 80px;
  }
  .countdown-text {
    font-size: 18px;
  }
}
</style>
