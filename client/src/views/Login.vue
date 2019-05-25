<template>
  <v-app>
    <v-content class="back-white">
      <login />
    </v-content>
  </v-app>
</template>

<script>
import Login from '@/components/Login2.vue'
export default {
  name: 'Login',
  components: {
    'login': Login
  }
}
</script>

<style scoped>

</style>
