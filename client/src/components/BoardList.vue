<template>
  <v-container class="mb-5">
    <v-layout
      wrap
      justify-center
      row
      v-if="boardDatas.length > 0"
    >
      <v-progress-circular
        v-if="progressCircle"
        indeterminate
        color="primary"
      />
      <v-flex
        xs12
        md6
      >
        <v-card class="border-round">
          <v-list dense>
            <template v-for="(boardData, index) in boardDatas">
              <v-list-tile
                :key="index"
                :to="boardData.id + ''"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ boardData.name }}</v-list-tile-title>
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
  name: 'BoardList',
  data: () => ({
    boardDatas: [],
    TEMPLATE: {
      boardData: {
        name: '',
        id: ''
      }
    },
    progressCircle: true
  }),
  computed: {
  },
  async created () {
    await this.getBoardData()
    this.progressCircle = false
  },
  methods: {
    async getBoardData () {
      const res = await this.$http.get('/api/board/list')
      const datas = res.data.result.rows
      this.setBoardData(datas)
    },
    setBoardData (datas) {
      for (let data of datas) {
        let boardData = {}
        boardData.name = data.name
        boardData.id = data.id
        this.boardDatas.push(boardData)
      }
    }
  }
}
</script>

<style scoped>

</style>
