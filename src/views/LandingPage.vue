<template>
  <div class="guardian-view">
    <div class="container">
      <img src="../assets/header.png" alt="header" />
      <h4 class="text__left">GUAR</h4>
      <h4 class="text__right">DIAN</h4>

      <button class="btn explore" @click="redirectToRegister">LOGIN</button>

      <h5 class="feature-1">Secure</h5>
      <h5 class="feature-2">Safeguard</h5>
      <h5 class="feature-3">Alert</h5>
      <h5 class="feature-4">Protect</h5>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ScrollReveal from 'scrollreveal'

const router = useRouter()

const redirectToRegister = () => {
  router.push('/LoginPage')
}

onMounted(() => {
  // The slide at the start
  const scrollRevealOption = {
    distance: '50px',
    origin: 'bottom',
    duration: 1000,
  }

  // below is image for icon
  ScrollReveal().reveal('.container img', {
    duration: 1000,
    delay: 1200,
  })

  // below is text for Guar
  ScrollReveal().reveal('.container .text__left', {
    ...scrollRevealOption,
    origin: 'right',
    delay: 2000,
  })

  // below is text for Dian
  ScrollReveal().reveal('.container .text__right', {
    ...scrollRevealOption,
    origin: 'left',
    delay: 2000,
  })

  // below is for Login
  ScrollReveal().reveal('.container .explore', {
    duration: 1000,
    delay: 3900,
  })

  // Features words
  ScrollReveal().reveal('.container h5', {
    duration: 1400,
    interval: 250,
    delay: 2700,
  })
})
</script>

<style src="../assets/LandingPage.css"></style>
