<template>
  <v-app>
    <v-toolbar
      app
      height="40"
      color="primary"
    >
      <v-layout
        justify-center
        class="title white--text font-weight-bold"
      >
        <div> 내 정보</div>
      </v-layout>
    </v-toolbar>
    <v-content>
      <MyPage />
      <BottomNav bottom-nav="mypage" />
    </v-content>
  </v-app>
</template>

<script>
import MyPage from '@/components/MyPage'
import BottomNav from '@/components/BottomNav'

export default {
  components: {
    BottomNav,
    MyPage
  },
  methods: {
  }
}
</script>
