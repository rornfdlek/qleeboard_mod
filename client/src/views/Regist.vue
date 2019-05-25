<template>
  <v-app>
    <v-content class="back-white">
      <regist />
    </v-content>
  </v-app>
</template>

<script>
import Regist from '@/components/Regist.vue'
export default {
  name: 'Regist',
  components: {
    'regist': Regist
  }
}
</script>

<style scoped>

</style>
