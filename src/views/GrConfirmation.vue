<template>
  <v-app>
    <v-main class="success-bg">
      <v-container class="d-flex justify-center align-center" style="height: 100vh">
        <v-card class="pa-6 text-center" elevation="4" max-width="500">
          <v-icon color="green" size="48" class="mb-4">mdi-check-circle</v-icon>
          <h2 class="text-h5 font-weight-bold mb-2">Success!</h2>
          <p class="text-body-1">Your report has been sent successfully.</p>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'SuccessMessage',
}
</script>

<style scoped>
.success-bg {
  background-color: #4caf50 !important;
}
</style>
