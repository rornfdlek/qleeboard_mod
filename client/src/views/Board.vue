<template>
  <v-app>
    <v-toolbar
      app
      height="30"
      class="back-white"
    >
      <v-btn
        icon
        class="primary--text"
        @click="$router.go(-1)"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-layout
        justify-center
        class="title primary--text"
      >
        <div> {{ boardName }}</div>
      </v-layout>
    </v-toolbar>
    <v-content class="back-white">
      <PostList />
      <WriteDialog />
    </v-content>
  </v-app>
</template>

<script>
import PostList from '@/components/PostList.vue'
import WriteDialog from '@/views/WriteDialog.vue'

export default {
  name: 'BoardListView',
  components: {
    PostList,
    WriteDialog
  },
  data: () => ({
    boardName: '게시판'
  }),
  async created () {
    this.getBoardName()
  },
  methods: {
    async getBoardName () {
      const res = await this.$http.get('/api/board/' + this.$route.params.id)
      this.boardName = res.data.result.name
    }
  }
}
</script>

<style scoped>

</style>
