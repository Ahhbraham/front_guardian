<template>
  <v-app>
    <v-main class="app-background">
      <v-container fluid>
        <v-row>
          <!-- Contacts Section -->
          <v-col cols="12" md="4">
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
                  :class="[
                    'message-bubble',
                    message.sender_id === currentUser.id ? 'sent' : 'received',
                  ]"
                >
                  <div v-if="message.sender_id !== currentUser.id" class="message-avatar">
                    <v-avatar size="32">
                      <img :src="selectedContact.avatar" :alt="selectedContact.name" />
                    </v-avatar>
                  </div>
                  <div class="message-content">
                    <div class="message-text">{{ message.message }}</div>
                    <div class="message-meta">
                      <v-icon v-if="message.sender_id === currentUser.id" small class="read-icon"
                        >mdi-check-all</v-icon
                      >
                      <span class="message-time">{{ formatTime(message.created_at) }}</span>
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
                  :disabled="!newMessage.trim() || sending"
                  :loading="sending"
                >
                  <v-icon>mdi-send</v-icon>
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
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      contacts: [],
      selectedContact: null,
      messages: [],
      newMessage: '',
      currentUser: {}, // Will store logged-in user info
      sending: false,
    }
  },
  async created() {
    await this.fetchCurrentUser()
    await this.fetchContacts()
  },
  methods: {
    async fetchCurrentUser() {
      try {
        const response = await axios.get('/api/user')
        this.currentUser = response.data
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    },
    async fetchContacts() {
      try {
        const response = await axios.get('/api/contacts')
        this.contacts = response.data
      } catch (error) {
        console.error('Error fetching contacts:', error)
      }
    },
    async selectContact(contact) {
      this.selectedContact = contact
      await this.fetchMessages(contact.id)
    },
    async fetchMessages(contactId) {
      try {
        const response = await axios.get(`/api/messages/${contactId}`)
        this.messages = response.data
        this.scrollToBottom()
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    },
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    async sendMessage() {
      if (!this.newMessage.trim() || !this.selectedContact) return

      this.sending = true

      try {
        const response = await axios.post('/api/messages', {
          receiver_id: this.selectedContact.id,
          message: this.newMessage,
        })

        // Add the new message to the local array
        this.messages.push(response.data.message)
        this.newMessage = ''
        this.scrollToBottom()
      } catch (error) {
        console.error('Error sending message:', error)
        this.$toast.error('Failed to send message')
      } finally {
        this.sending = false
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },
    showContactInfo(contact) {
      alert(`Contact Info:\nName: ${contact.name}`)
    },
    showAttachmentMenu() {
      alert('Attachment menu would open here')
    },
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
