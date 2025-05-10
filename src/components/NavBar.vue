<template>
  <!-- Below hides navbar in Splash -->
  <v-app-bar v-if="$route.path !== '/'" color="#f5f5f5" scroll-behavior="hide">
    <v-toolbar-title>
      <v-btn to="/" color="#000C66" class="font-weight-bold">Guardian</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <div class="nav-buttons">
      <v-btn to="/HomePage" color="#000C66" variant="text">Home</v-btn>
      <!-- Main -->
      <v-btn to="/FirstAid" color="#000C66" variant="text">First Aid</v-btn>
      <v-btn to="/GuardianAlert" color="#000C66" variant="text">Guardian Alert</v-btn>
      <v-btn to="/LiveTrack" color="#000C66" variant="text">Live Track</v-btn>
      <v-btn to="/GuardianReport" color="#000C66" variant="text">Guardian Report</v-btn>
      <v-btn to="/ZonalUpdates" color="#000C66" variant="text">Zonal Updates</v-btn>
      <!-- Login and Register -->
      <v-btn to="/LoginPage" color="#000C66" variant="text">Login</v-btn>
      <v-btn to="/RegisterPage" color="#000C66" variant="text">Join us</v-btn>
      <!-- abilities -->
      <v-btn to="/PoliceDashboard" color="#000C66" variant="text">PD</v-btn>
      <v-btn to="/AmbulanceDashboard" color="#000C66" variant="text">AD</v-btn>
      <v-btn to="/FireServicesDashboard" color="#000C66" variant="text">FSD</v-btn>
      <v-btn to="/Admin" color="#000C66" variant="text">Admin</v-btn>
    </div>
  </v-app-bar>
</template>

<style scoped>
.nav-buttons {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  gap: 8px;
}

.nav-buttons::-webkit-scrollbar {
  display: none;
}
</style>
