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
        <div>관리자 화면</div>
      </v-layout>
    </v-toolbar>
    <v-content>
      <v-container class="mb-5 px-0">
        <v-layout
          v-if="boardDatas.length > 0"
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
            md6
          >
            <v-card>
              <v-list dense>
                <template v-for="(boardData, index) in boardDatas">
                  <v-list-tile
                    :key="index"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>{{ boardData.name }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-btn
                        icon
                        @click="deleteBoardDialog = true; deleteSelectItem = boardData.id; "
                      >
                        <v-icon color="primary">
                          highlight_off
                        </v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </template>
                <v-list-tile
                >
                  <v-list-tile-content>
                    <v-list-tile-title> 게시판 추가하기</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn
                      icon
                      @click="createBoardDialog = true"
                    >
                      <v-icon color="primary">
                        add_circle_outline
                      </v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-dialog
        v-model="deleteBoardDialog"
      >
        <v-card>
          <v-card-title
            class="title"
            primary-title
          >
            게시판 삭제
          </v-card-title>
          <v-card-text>
            게시판 삭제시 되돌릴 수 없습니다. 그래도 계속하시겠습니까?
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              flat
              @click="deleteBoardDialog = false"
            >
              취소
            </v-btn>
            <v-btn
              color="primary"
              flat
              @click="deleteBoard"
            >
              확인
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="createBoardDialog"
      >
        <v-card>
          <v-card-title
            class="title"
            primary-title
          >
            게시판 생성
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="createBoardData.boardName"
              label="게시판 이름"
            />
            <v-text-field
              v-model="createBoardData.boardDescription"
              label="게시판 설명"
            />
            <v-switch
              v-model="createBoardData.requireAuth"
              label="로그인 필요 여부"
              color="primary"
            ></v-switch>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              flat
              @click="createBoardDialog = false"
            >
              취소
            </v-btn>
            <v-btn
              color="primary"
              flat
              @click="createBoard"
            >
              생성
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'AdminMain',
  data: () => ({
    boardDatas: [],
    TEMPLATE: {
      boardData: {
        name: '',
        id: ''
      }
    },
    progressCircle: true,
    deleteBoardDialog: false,
    deleteSelectItem: 0,
    createBoardData: {
      boardName: '',
      boardDescription: '',
      requireAuth: false
    },
    createBoardDialog: false
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
      this.boardDatas = []
      for (let data of datas) {
        let boardData = {}
        boardData.name = data.name
        boardData.id = data.id
        this.boardDatas.push(boardData)
      }
    },
    async deleteBoard () {
      try {
        await this.$http.delete('/api/board/' + this.deleteSelectItem)
        this.deleteBoardDialog = false
        await this.getBoardData()
      } catch (e) {
        alert('에러가 발생했습니다')
      }
    },
    async createBoard () {
      try {
        await this.$http.post('/api/board', {
          boardName: this.createBoardData.boardName,
          boardDescription: this.createBoardData.boardDescription,
          requireAuth: this.createBoardData.requireAuth
        })
        this.createBoardDialog = false
        await this.getBoardData()
      } catch (e) {
        alert('에러가 발생했습니다')
      }
    }
  }
}
</script>

<style scoped>

</style>
