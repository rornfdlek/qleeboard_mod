<template>
  <v-app>
    <v-toolbar
      app
      height="40"
      class="back-white"
    >
      <v-btn
        icon
        class="primary--text"
        @click="$router.go(-1)"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <div class="primary--text font-weight-bold">
        {{ boardName }}
      </div>
    </v-toolbar>
    <v-content class="back-white">
      <Post />
    </v-content>
  </v-app>
</template>

<script>
import Post from '@/components/Post.vue'
export default {
  name: 'PostView',
  components: {
    Post
  },
  data: () => ({
    boardName: '게시판'
  }),
  async created () {
    this.getBoardName()
  },
  methods: {
    async getBoardName () {
      const res = await this.$http.get('/api/board/' + this.$route.params.boardId)
      this.boardName = res.data.result.name
    }
  }
}
</script>

<style scoped>

</style>
