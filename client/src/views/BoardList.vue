x<template>
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
        <div>게시판</div>
      </v-layout>
    </v-toolbar>
    <v-content>
      <BoardListComponent />
    </v-content>
    <BottomNav bottom-nav="board" />
  </v-app>
</template>

<script>
import BoardListComponent from '@/components/BoardList.vue'
import BottomNav from '@/components/BottomNav.vue'
export default {
  name: 'BoardListView',
  components: {
    BottomNav,
    BoardListComponent
  }
}
</script>

<style scoped>

</style>
