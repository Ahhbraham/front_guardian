<template>
  <!-- Below hides navbar in landing -->
  <v-app-bar v-if="$route.path !== '/'" color="#E2E2F3" scroll-behavior="hide">
    <v-toolbar-title>
      <v-btn to="/HomePage" color="#000C66" class="font-weight-bold">Guardian</v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>

    <div class="nav-buttons">
      <v-btn to="/LoginPage" color="#000C66" variant="text">Login</v-btn>
      <v-btn to="/RegisterPage" color="#000C66" variant="text">Join us</v-btn>
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
