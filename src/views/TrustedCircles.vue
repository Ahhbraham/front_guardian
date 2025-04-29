<template>
  <v-app>
    <v-main class="app-background">
      <v-container fluid>
        <v-row>
          <!-- Contacts Section -->
          <v-col cols="12" md="4">
            <!-- SOS Button -->
            <div class="sos-button-container">
              <v-btn
                fab
                :class="{ vibrating: !sosDialog }"
                @click="showSosDialog"
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
            <v-list color="transparent">
              <v-list-item
                v-for="(contact, index) in contacts"
                :key="index"
                class="modern-list-item"
                :class="{
                  'active-contact': selectedContact && selectedContact.id === contact.id,
                }"
                @click="showContactInfo(contact)"
              >
                <v-list-item-content>
                  <v-list-item-title class="contact-name">
                    {{ contact.name }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="d-flex align-center">
                  <v-avatar size="48" class="mr-4">
                    <img :src="contact.avatar" :alt="contact.name" />
                  </v-avatar>
                  <v-btn
                    color="#E2E2F3"
                    dark
                    depressed
                    @click.stop="selectContact(contact)"
                    class="modern-btn"
                    style="border-radius: 3px"
                  >
                    Chat
                    <v-icon right small>mdi-message-text</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-divider
                v-if="index < contacts.length - 1"
                :key="'divider-' + index"
                class="contact-divider"
              ></v-divider>
            </v-list>
          </v-col>

          <!-- Main Chat Area -->
          <v-col cols="12" md="8">
            <v-card v-if="selectedContact" flat class="modern-card chat-card" height="100%">
              <v-card-title class="chat-header">
                <v-avatar size="40" class="mr-3">
                  <img :src="selectedContact.avatar" :alt="selectedContact.name" />
                </v-avatar>
                <div>
                  <div class="chat-title">{{ selectedContact.name }}</div>
                </div>
                <v-spacer></v-spacer>
              </v-card-title>

              <!-- Message Display -->
              <v-card-text class="message-container" ref="messageContainer">
                <div class="message-date">Today</div>
                <div
                  v-for="(message, index) in messages"
                  :key="index"
                  :class="['message-bubble', message.sender === 'me' ? 'sent' : 'received']"
                >
                  <div v-if="message.sender === 'them'" class="message-avatar">
                    <v-avatar size="32">
                      <img :src="selectedContact.avatar" :alt="selectedContact.name" />
                    </v-avatar>
                  </div>
                  <div class="message-content">
                    <div class="message-text">{{ message.text }}</div>
                    <div class="message-meta">
                      <v-icon v-if="message.sender === 'me'" small class="read-icon"
                        >mdi-check-all</v-icon
                      >
                      <span class="message-time">{{ message.time }}</span>
                    </div>
                  </div>
                </div>
              </v-card-text>

              <!-- Input Row -->
              <v-card-actions class="input-area">
                <v-btn icon color="#4A6FA5" @click="showAttachmentMenu">
                  <v-icon>mdi-paperclip</v-icon>
                </v-btn>
                <v-text-field
                  v-model="newMessage"
                  label="Type your message..."
                  outlined
                  dense
                  hide-details
                  color="#4A6FA5"
                  class="modern-text-field"
                  @keyup.enter="sendMessage"
                ></v-text-field>
                <v-btn
                  color="#4A6FA5"
                  dark
                  icon
                  @click="sendMessage"
                  class="send-btn"
                  :disabled="!newMessage.trim()"
                >
                  <v-icon>mdi-send</v-icon>
                </v-btn>
                <v-btn icon color="#4A6FA5" @click="sendLocation" class="location-btn">
                  <v-icon>mdi-map-marker</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>

            <v-card flat class="modern-card empty-state-card" height="100%" v-else>
              <v-card-text class="empty-state">
                <v-icon size="64" color="#4A6FA5">mdi-message-text-outline</v-icon>
                <div class="empty-state-title">No chat selected</div>
                <div class="empty-state-subtitle">Choose a contact to start messaging</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- SOS Dialog -->
      <v-dialog v-model="sosDialog" max-width="400" persistent>
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
            <div class="contacts-header">Contacts</div>
            <div class="contacts-list">
              <div
                v-for="(contact, index) in contacts"
                :key="'contact-' + index"
                class="contact-item"
                @click="startCountdown(contact.name)"
              >
                <v-avatar size="40" class="contact-avatar">
                  <img :src="contact.avatar" :alt="contact.name" />
                </v-avatar>
                <div class="contact-details">
                  <div class="contact-name">{{ contact.name }}</div>
                </div>
              </div>
            </div>
          </v-card-text>
          <v-card-actions style="padding: 16px">
            <v-spacer></v-spacer>
            <v-btn color="#333333" text @click="sosDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      contacts: [
        {
          name: 'John Doe',
          id: 1,
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48&q=80',
        },
        {
          name: 'Jane Smith',
          id: 2,
          avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48&q=80',
        },
        {
          name: 'Emergency Services',
          id: 3,
          avatar:
            'https://images.unsplash.com/photo-1584464491722-7e5335662a2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48&q=80',
        },
      ],
      selectedContact: null,
      messages: [],
      newMessage: '',
      sosDialog: false,
      countdownActive: false,
      countdown: 5,
      countdownInterval: null,
      selectedService: '',
    }
  },
  methods: {
    selectContact(contact) {
      this.selectedContact = contact
      this.messages = [
        {
          text: 'Hello! How are you doing today?',
          sender: 'them',
          time: '10:30 AM',
        },
        {
          text: "I'm good, thanks for asking! How about you?",
          sender: 'me',
          time: '10:32 AM',
        },
        {
          text: "I'm doing well. Just wanted to check in with you.",
          sender: 'them',
          time: '10:33 AM',
        },
      ]
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    sendMessage() {
      if (this.newMessage.trim() === '') return

      this.messages.push({
        text: this.newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
      this.newMessage = ''

      // Simulate reply after 1 second
      setTimeout(() => {
        this.messages.push({
          text: this.getRandomReply(),
          sender: 'them',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        })
        this.scrollToBottom()
      }, 1000)

      this.scrollToBottom()
    },
    getRandomReply() {
      const replies = [
        "That's interesting!",
        'I see what you mean.',
        'Thanks for letting me know.',
        "I'll get back to you on that.",
        'Sounds good!',
        'Can we talk about this later?',
        'I appreciate your message.',
      ]
      return replies[Math.floor(Math.random() * replies.length)]
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },
    sendLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = `https://www.openstreetmap.org/?mlat=${position.coords.latitude}&mlon=${position.coords.longitude}#map=15/${position.coords.latitude}/${position.coords.longitude}`
            this.messages.push({
              text: `Here's my current location: ${location}`,
              sender: 'me',
              time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            })
            this.scrollToBottom()
          },
          (error) => {
            console.error('Error getting location:', error)
            alert('Could not get your location')
          },
        )
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },
    showContactInfo(contact) {
      alert(`Contact Info:\nName: ${contact.name}`)
    },
    showAttachmentMenu() {
      alert('Attachment menu would open here')
    },
    showSosDialog() {
      this.sosDialog = true
    },
    startCountdown(service) {
      this.selectedService = service
      this.sosDialog = false
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
      if (this.contacts.some((contact) => contact.name === service)) {
        this.notifyContact(service)
      } else {
        alert(`Contacting ${service}`)
      }
    },
    notifyContact(contactName) {
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
/* Base Styles */
.app-background {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

/* Card Styles */
.modern-card {
  border-radius: 16px;
  background: #ffffff;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
}

.modern-card:hover {
  transform: translateY(-5px);
}

.chat-card {
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.empty-state-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

/* SOS Button */
.sos-button-container {
  display: flex;
  justify-content: center;
  padding: 16px 0;
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

/* Header Styles */
.chat-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eaeef5;
  background: linear-gradient(to right, #f8fafc, #ffffff);
}

.chat-title {
  font-weight: 600;
  color: #2c3e50;
}

/* Contact List Styles */
.modern-list-item {
  margin: 12px 16px;
  padding: 16px 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.modern-list-item:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.active-contact {
  background: #e8f0fe;
}

.contact-name {
  font-weight: 500;
  color: #2c3e50;
  font-size: 1.1rem;
}

.contact-divider {
  border-color: rgba(0, 0, 0, 0.1);
  margin: 0 16px;
}

/* Message Styles */
.message-container {
  padding: 16px;
  height: calc(100% - 120px);
  overflow-y: auto;
  background-color: #f5f7fa;
  background-image:
    linear-gradient(#e4e8f0 1px, transparent 1px),
    linear-gradient(90deg, #e4e8f0 1px, transparent 1px);
  background-size: 20px 20px;
}

.message-date {
  text-align: center;
  color: #7f8c8d;
  font-size: 0.75rem;
  margin: 16px 0;
  position: relative;
}

.message-date::before,
.message-date::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #eaeef5;
}

.message-date::before {
  left: 0;
}

.message-date::after {
  right: 0;
}

.message-bubble {
  display: flex;
  margin-bottom: 16px;
  max-width: 80%;
  transition: all 0.3s ease;
}

.message-bubble:hover {
  transform: translateY(-2px);
}

.received {
  margin-right: auto;
  align-items: flex-start;
}

.sent {
  margin-left: auto;
  align-items: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  margin-right: 12px;
}

.sent .message-avatar {
  margin-right: 0;
  margin-left: 12px;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-text {
  padding: 12px 16px;
  border-radius: 18px;
  line-height: 1.4;
  word-wrap: break-word;
  font-size: 0.95rem;
}

.received .message-text {
  background: white;
  color: #2c3e50;
  border-top-left-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.sent .message-text {
  background: #4a6fa5;
  color: white;
  border-top-right-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-meta {
  display: flex;
  align-items: center;
  margin-top: 4px;
  font-size: 0.75rem;
}

.received .message-meta {
  justify-content: flex-start;
  padding-left: 16px;
  color: #7f8c8d;
}

.sent .message-meta {
  justify-content: flex-end;
  padding-right: 16px;
  color: #7f8c8d;
}

.read-icon {
  color: #4a6fa5;
  margin-right: 4px;
}

/* Input Area */
.input-area {
  padding: 12px 16px;
  border-top: 1px solid #eaeef5;
  background: white;
}

.modern-text-field {
  border-radius: 24px;
  margin: 0 12px;
}

.modern-text-field >>> .v-input__slot {
  min-height: 48px !important;
  padding: 0 16px !important;
}

.send-btn,
.location-btn {
  transition: all 0.3s ease;
}

.send-btn:hover {
  transform: scale(1.1);
}

.send-btn:disabled {
  opacity: 0.5;
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

/* Scrollbar */
.message-container::-webkit-scrollbar {
  width: 6px;
}

.message-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.message-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.message-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-state-title {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-top: 16px;
  font-weight: 500;
}

.empty-state-subtitle {
  font-size: 1rem;
  color: #7f8c8d;
  margin-top: 8px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .countdown-number {
    font-size: 80px;
  }
  .countdown-text {
    font-size: 18px;
  }
}
</style>
