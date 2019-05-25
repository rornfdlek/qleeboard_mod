x<template>
  <v-app>
    <v-toolbar
      app
      height="40"
      class="back-white"
    >
      <v-layout
        justify-center
        class="title primary--text font-weight-bold"
      >
        <div>게시판</div>
      </v-layout>
    </v-toolbar>
    <v-content class="back-white">
      <BoardList />
    </v-content>
    <BottomNav bottom-nav="board" />
  </v-app>
</template>

<script>
import BoardList from '@/components/BoardList.vue'
import BottomNav from '@/components/BottomNav.vue'
export default {
  name: 'BoardListView',
  components: {
    BoardList,
    BottomNav
  }
}
</script>

<style scoped>

</style>
