<template>
  <v-app>
    <v-toolbar
      app
      height="40"
      color="primary"
    >
      <v-btn
        icon
        class="white--text"
        @click="$router.go(-1)"
      >
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      <v-layout
        justify-center
        class="title white--text font-weight-bold"
      >
        <div v-if="!isSearching">
          {{ boardName }}
        </div>
        <div v-else>
          <v-text-field
            v-model="searchKeyword"
            full-width
            color="white"
            dark
            class="white--text"
            label="검색어를 입력하세요"
            append-icon="search"
            append-outer-icon="cancel"
            @click:append="goSearch"
            @keypress.enter.prevent="goSearch"
            @click:append-outer="isSearching = false; goSearch()"
          />
        </div>
      </v-layout>
      <v-btn
        v-if="!isSearching"
        icon
        class="white--text"
        @click="isSearching = true"
      >
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
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
      <WriteDialog />
    </v-content>
  </v-app>
</template>

<script>
import WriteDialog from '@/views/WriteDialog.vue'
import { EventBus } from '@/utils/EventBus'
export default {
  name: 'Board',
  components: {
    WriteDialog
  },
  data: () => ({
    boardName: '게시판',
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
    postList: [],
    searchKeyword: '',
    isSearching: false
  }),
  watch: {
    async page (to, from) {
      this.goSearch()
    }
  },
  async created () {
    this.getBoardName()
    this.goSearch()
    EventBus.$on('get-new-data', async () => {
      try {
        this.goSearch()
      } catch (e) {
        console.log(e)
      }
    })
  },
  methods: {
    async getBoardName () {
      const res = await this.$http.get('/api/board/' + this.$route.params.id)
      this.boardName = res.data.result.name
    },
    async getPostList (isSearching) {
      const boardId = this.$route.params.id
      let searchKey = ''
      if (isSearching) searchKey = '&searchKeyword=' + this.searchKeyword
      const res = this.$http.get('/api/board/' + boardId + '/post/list' + '?page=' + this.page + '&limit=' + this.rowsPerPage + searchKey)
      return res
    },
    setPostList (res) {
      this.postList = res.data.result.rows
      const alpha = parseInt(res.data.result.count % this.rowsPerPage) === 0 ? 0 : 1
      this.totalPage = parseInt(res.data.result.count / this.rowsPerPage) + alpha
    },
    async goSearch () {
      this.progressCircle = true
      const res = await this.getPostList(this.isSearching)
      this.setPostList(res)
      this.progressCircle = false
    }
  }
}
</script>

<style scoped>

</style>
