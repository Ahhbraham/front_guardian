<template>
  <v-app style="background: #f5f5f5">
    <v-main>
      <v-container fluid class="pa-0" style="height: 100vh">
        <!-- Header Icon -->
        <img src="../assets/header.png" class="header-icon" alt="Header Icon" />

        <v-row no-gutters style="height: 100%">
          <v-col cols="12" md="6" class="pa-0 d-flex">
            <div class="d-flex flex-column" style="width: 100%">
              <v-card flat style="height: 25%; background: #ebedff"></v-card>
              <v-card flat style="height: 25%; background: #8593ff"></v-card>
              <v-card flat style="height: 25%; background: #0018cc"></v-card>
              <v-card flat style="height: 25%; background: #000c66"></v-card>
            </div>

            <!-- Text Content (overlay) -->
            <div
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 50%;
                height: 100%;
                display: flex;
                align-items: center;
                padding-left: 48px;
                z-index: 100;
              "
            >
              <h1 class="text-h1 font-weight-bold mb-2" style="color: #ffffff">
                MAKE CITIES SAFER
              </h1>
            </div>
          </v-col>

          <!-- Right Column with Crime Statistics Charts -->
          <v-col cols="12" md="6" class="pa-0">
            <div
              id="stats-container"
              style="
                height: 100%;
                overflow-y: auto;
                border-left: 1px solid #eee;
                background: white;
                padding: 16px 0 16px 16px;
              "
            >
              <h2 class="text-h4 font-weight-bold mb-4 px-4">Regional Crime Comparison</h2>
              <canvas id="crimeChart" style="max-height: 500px; width: 100%"></canvas>
            </div>
          </v-col>
        </v-row>

        <!-- Divider for Separation -->
        <v-divider class="my-4" style="border-color: #e0e0e0; border-width: 0.5px"></v-divider>

        <!-- Full-width Cards Container -->
        <v-row no-gutters>
          <v-col cols="12" class="pa-0">
            <div class="cards-container">
              <div class="card__article" v-for="(card, index) in cards" :key="index">
                <img :src="card.image" alt="Card image" class="card__img" />
                <div class="card__data">
                  <span class="card__description">{{ card.description }}</span>
                  <h2 class="card__title">{{ card.title }}</h2>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Added Footer Section -->
        <v-footer color="#000c66" padless>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <div class="footer-section">
                  <h3 class="footer-heading white--text">Legal</h3>
                  <v-divider class="my-2" style="border-color: #8593ff"></v-divider>
                  <ul class="footer-links">
                    <li><a href="#" class="footer-link">Privacy Policy</a></li>
                    <li><a href="#" class="footer-link">Terms of Use</a></li>
                  </ul>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="footer-section">
                  <h3 class="footer-heading white--text">Contact Us</h3>
                  <v-divider class="my-2" style="border-color: #8593ff"></v-divider>
                  <ul class="footer-contact">
                    <li>
                      <v-icon small color="#8593ff" class="mr-2">mdi-email</v-icon>
                      <span class="footer-text">Guardian@gmail.com</span>
                    </li>
                    <li>
                      <v-icon small color="#8593ff" class="mr-2">mdi-phone</v-icon>
                      <span class="footer-text">+1 (555) 123-4567</span>
                    </li>
                    <li>
                      <v-icon small color="#8593ff" class="mr-2">mdi-map-marker</v-icon>
                      <span class="footer-text">123 Safety Ave, Secure City, SC 12345</span>
                    </li>
                  </ul>
                </div>
              </v-col>
            </v-row>
            <v-divider class="my-4" style="border-color: #8593ff"></v-divider>
            <div class="text-center white--text py-4">
              © {{ new Date().getFullYear() }} Guardian. All rights reserved.
            </div>
          </v-container>
        </v-footer>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'

// Import images using ES modules
import MapImage from '../assets/Map.jpg'
import EmergencyImage from '../assets/Emergency.png'
import SupportImage from '../assets/Support.jpg'
import CommunityImage from '../assets/Community.jpeg'

export default {
  name: 'SafetyApp',
  data() {
    return {
      cards: [
        {
          image: MapImage,
          description:
            'Trusted contact alerts and location-based danger warnings for proactive protection',
          title: 'Personal Safety & Realtime Tracking',
        },
        {
          image: EmergencyImage,
          description:
            'Step-by-step emergency medical guides and recovery support when seconds count',
          title: 'First Aid & Medical Assistance',
        },
        {
          image: SupportImage,
          description: 'Anonymous reporting for a better society',
          title: 'Reporting',
        },
        {
          image: CommunityImage,
          description:
            'Community-driven safety initiatives and real-time incident mapping for awareness',
          title: 'Community Safety Network',
        },
      ],
    }
  },
  setup() {
    onMounted(() => {
      // Horizontal Bar Chart for Crime Index
      const ctxCrime = document.getElementById('crimeChart').getContext('2d')
      new Chart(ctxCrime, {
        type: 'bar',
        data: {
          labels: [
            'Nairobi (Africa)',
            'New York (North America)',
            'London (Europe)',
            'Sydney (Australia)',
            'Rio de Janeiro (South America)',
            'Tokyo (Asia)',
          ],
          datasets: [
            {
              label: 'Crime Index (2024)',
              data: [59.1, 48.3, 44.6, 35.2, 68.7, 22.3],
              backgroundColor: [
                '#FF6384', // Red
                '#36A2EB', // Blue
                '#FFCE56', // Yellow
                '#4BC0C0', // Teal
                '#9966FF', // Purple
                '#FF9F40', // Orange
              ],
              borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                padding: 0,
              },
            },
            y: {
              grid: {
                display: false,
                drawBorder: false,
              },
              ticks: {
                padding: 0,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.raw} Crime Index`
                },
              },
            },
          },
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
      })
    })
  },
}
</script>

<style scoped>
#stats-container {
  background: white;
}

.header-icon {
  position: absolute;
  top: 20px;
  left: 260px;
  z-index: 1000;
  width: 120px;
  height: auto;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding: 2rem;
  background: #f5f5f5;
}

.card__article {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  height: 350px;
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2rem;
  transition: transform 0.3s ease;
}

.card__article:hover .card__img {
  transform: scale(1.05);
}

.card__data {
  width: 100%;
  background-color: white;
  padding: 2rem;
  box-shadow: 0 8px 24px hsla(0, 0%, 0%, 0.15);
  border-radius: 1.5rem;
  position: absolute;
  bottom: -12rem;
  left: 0;
  right: 0;
  opacity: 0;
  transition: all 0.5s ease;
}

.card__article:hover .card__data {
  transform: translateY(-10rem);
  opacity: 1;
}

.card__description {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: hsl(0, 0%, 35%);
}

.card__title {
  font-size: 1.5rem;
  font-weight: 500;
  color: hsl(0, 0%, 15%);
  margin-bottom: 1rem;
}

@media (max-width: 960px) {
  .cards-container {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    background: #f5f5f5;
  }

  .card__data {
    width: 100%;
    left: 0;
    right: 0;
    padding: 1.5rem;
  }

  .card__article {
    height: 300px;
  }
}

/* Footer Styles */
.footer-section {
  margin-bottom: 1.5rem;
}

.footer-heading {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #8593ff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ebedff;
  text-decoration: underline;
}

.footer-contact {
  list-style: none;
  padding: 0;
}

.footer-contact li {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.footer-text {
  color: #ebedff;
  font-size: 0.9rem;
}

@media (max-width: 960px) {
  .footer-section {
    text-align: center;
  }

  .footer-contact li {
    justify-content: center;
  }
}
</style>
