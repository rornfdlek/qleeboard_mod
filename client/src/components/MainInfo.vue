<template>
  <v-container class="mb-5 px-0">
    <v-layout
      v-if="summaryDatas"
      wrap
      row
      justify-center
    >
      <v-flex
        v-for="(items, i) in summaryDatas"
        :key="i"
        xs12
        md8
        mb-3
        px-0
      >
        <v-card>
          <v-list dense>
            <v-subheader
              class="font-weight-bold primary--text subheading"
              @click="$router.push('/board/' + items.boardId)"
            >
              {{ items.boardName }}
              <v-spacer></v-spacer>
              <v-icon class="primary--text">keyboard_arrow_right</v-icon>
            </v-subheader>
            <template v-for="(item, index) in items.postDatas">
              <v-list-tile
                :key="index"
                @click="$router.push('/board/' + items.boardId + '/' + item.id)"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.subject }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.contents }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    summaryDatas: [],
    TEMPLATE: {
      summaryData:
        {
          boardName: '',
          boardId: 0,
          postDatas: [
            {
              subject: '',
              contents: '',
              id: ''
            }
          ]
        }
    }
  }),
  async created () {
    await this.getBoardList()
    await this.getPostList()
  },
  methods: {
    async getBoardList () {
      const res = await this.$http.get('/api/board/list?limit=5')
      const data = res.data.result.rows
      this.setBoardList(data)
    },
    setBoardList (datas) {
      this.summaryDatas = []
      for (let data of datas) {
        let summaryData = {}
        summaryData.boardName = data.name
        summaryData.boardId = data.id
        summaryData.postDatas = []
        this.summaryDatas.push(summaryData)
      }
    },
    async getPostList () {
      for (let board of this.summaryDatas) {
        const res = await this.$http.get('/api/board/' + board.boardId + '/post/list/' + '?limit=5')
        const datas = res.data.result.rows
        this.setPostList(board, datas)
      }
    },
    setPostList (board, datas) {
      for (let data of datas) {
        let post = {}
        post.subject = data.subject
        post.contents = data.contents
        post.id = data.id
        board.postDatas.push(post)
      }
    }
  }
}
</script>

<style>

</style>
