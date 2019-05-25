<template>
  <v-container>
    <v-layout
      v-if="postList.length > 0"
      wrap
      justify-center
      row
    >
      <v-progress-circular
        v-if="progressCircle"
        indeterminate
        color="primary"
      />
      <v-flex
        xs12
        md8
      >
        <v-card class="border-round">
          <v-list dense>
            <template v-for="(post, index) in postList">
              <v-list-tile
                :key="index"
                @click="$router.push('/board/' + $route.params.id + '/' + post.id)"
              >
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ post.subject }}
                    <span class="primary--text">{{ '  ' + post.comments_count }}</span>
                  </v-list-tile-title>
                  <v-list-tile-sub-title>{{ post.contents }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        md8
      >
        <div class="text-xs-center pt-2">
          <v-pagination
            v-model="page"
            :length="totalPage"
            :total-visible="7"
          />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { EventBus } from '@/utils/EventBus'

export default {
  name: 'PostList',
  data: () => ({
    TEMPLATE: {
      boardData: {
        name: '',
        id: ''
      }
    },
    progressCircle: true,
    page: 1,
    rowsPerPage: 10, // -1 for All
    totalPage: 0,
    postList: []
  }),
  computed: {
  },
  watch: {
    async page (to, from) {
      this.progressCircle = true
      const res = await this.getPostList()
      this.setPostList(res)
      this.progressCircle = false
    }
  },
  async created () {
    const res = await this.getPostList()
    this.setPostList(res)
    this.progressCircle = false

    EventBus.$on('get-new-data', async () => {
      try {
        const res = await this.getPostList()
        this.setPostList(res)
      } catch (e) {
        console.log(e)
      }
    })
  },
  methods: {
    async getPostList () {
      const boardId = this.$route.params.id
      const res = this.$http.get('/api/board/list/' + boardId + '?page=' + this.page + '&offset=' + this.rowsPerPage)
      return res
    },
    setPostList (res) {
      this.postList = res.data.result.rows
      const alpha = parseInt(res.data.result.count % this.rowsPerPage) === 0 ? 0 : 1
      this.totalPage = parseInt(res.data.result.count / this.rowsPerPage) + alpha
    }
  }
}
</script>

<style scoped>

</style>
