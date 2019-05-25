<template>
  <v-app>
    <v-toolbar
      app
      height="40"
      class="back-white"
    >
      <v-layout
        justify-center
        class="title primary--text"
      >
        <div>QLeeBoard</div>
      </v-layout>
    </v-toolbar>
    <v-content class="back-white">
      <MainInfo />
    </v-content>
    <BottomNav bottom-nav="main" />
  </v-app>
</template>

<script>
import MainInfo from '@/components/MainInfo.vue'
import BottomNav from '@/components/BottomNav.vue'

export default {
  name: 'Main',
  components: {
    MainInfo,
    BottomNav
  }
}
</script>

<style scoped>

</style>
