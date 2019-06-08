<template>
  <v-app>
    <v-toolbar
      app
      height="40"
      color="primary"
    >
      <v-layout
        justify-center
        class="title white--text"
      >
        <div>QLeeBoard</div>
      </v-layout>
      <v-btn
        v-if="$store.getters.getMod === 1"
        icon
        class="white--text"
        @click="$router.push('admin')"
      >
        <v-icon>supervised_user_circle</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
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
