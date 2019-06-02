<template>
  <v-app>
    <v-content>
      <login />
    </v-content>
  </v-app>
</template>

<script>
import Login from '@/components/Login.vue'
export default {
  name: 'Login',
  components: {
    'login': Login
  }
}
</script>

<style scoped>

</style>
