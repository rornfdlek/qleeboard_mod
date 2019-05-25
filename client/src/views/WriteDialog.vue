<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container
    grid-list-md
    text-xs-center
  >
    <v-layout
      row
      justify-center
      wrap
    >
      <v-dialog
        v-model="writeView"
        fullscreen
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="float-plus"
            color="primary"
            fab
            small
            dark
            @click="showWriteDialog"
          >
            <v-icon>create</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="closeWriteDialog"
            >
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>글쓰기</v-toolbar-title>
            <v-spacer />
            <v-toolbar-items>
              <v-btn
                dark
                flat
                @click="saveAndCloseDialog"
              >
                Save
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-flex
            xs12
            px-4
          >
            <v-select
              v-model="writeForm.boardId"
              label="게시판"
              :items="boardDatas"
              item-text="name"
              item-value="id"
            />
          </v-flex>
          <v-flex
            xs12
            px-4
          >
            <v-text-field
              v-model="writeForm.subject"
              label="제목"
            />
          </v-flex>
          <v-flex
            xs12
            px-4
          >
            <v-textarea
              v-model="writeForm.contents"
              name="comment"
              label="내용을 입력하세요"
              value=""
            />
          </v-flex>
          <v-flex
            xs12
            px-4
          >
            <v-layout
              row
              wrap
            >
              <v-flex xs12>
                <v-card>
                  <v-container
                    grid-list-sm
                    fluid
                    class="pa-0"
                  >
                    <v-layout
                      row
                      wrap
                    >
                      <v-flex
                        v-for="(image,i) in writeForm.images"
                        :key="i"
                        xs4
                        d-flex
                      >
                        <v-card
                          flat
                          tile
                          class="d-flex"
                        >
                          <v-img
                            :src="image"
                            :lazy-src="image"
                            aspect-ratio="1"
                            class="grey lighten-2"
                          >
                            <template v-slot:placeholder>
                              <v-layout
                                fill-height
                                align-center
                                justify-center
                                ma-0
                              >
                                <v-progress-circular
                                  indeterminate
                                  color="grey lighten-5"
                                />
                              </v-layout>
                            </template>
                          </v-img>
                        </v-card>
                      </v-flex>
                      <v-flex
                        xs4
                        d-flex
                      >
                        <v-card
                          flat
                          tile
                          class="d-flex"
                        >
                          <input
                            v-show="false"
                            id="file-input"
                            type="file"
                            name="img"
                            multiple="multiple"
                            accept="image/*"
                            @change="uploadImages($event.target.name, $event.target.files)"
                            @drop="uploadImages($event.target.name, $event.target.files)"
                          >
                          <label for="file-input">
                            <v-img
                              :src="require('../assets/add.png')"
                              aspect-ratio="1"
                            />
                          </label>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>

import { EventBus } from '@/utils/EventBus'
export default {
  name: 'WriteDialog',
  data () {
    return {
      writeView: false,
      boardDatas: [],
      images: [],
      writeForm: {
        subject: '',
        contents: '',
        images: [],
        boardId: 0
      }
    }
  },
  computed: {
    userEmail: function () {
      return this.$store.getters.getUserEmail
    }
  },
  async created () {
    await this.getBoardData()
  },
  methods: {
    closeWriteDialog: function () {
      EventBus.$emit('get-new-data')
      this.writeView = false
    },
    saveAndCloseDialog: function () {
      this.writeForm.userId = this.userEmail
      this.$http.post('/api/board', this.writeForm)
        .then((response) => {
          this.closeWriteDialog()
        })
    },
    uploadImages: function (name, files) {
      const formData = new FormData()
      for (let file of files) {
        formData.append(name, file, file.name)
      }
      this.$http.post('/api/upload/images', formData)
        .then((response) => {
          let currentUrl = window.location.host
          for (let image of response.data.result) {
            this.writeForm.images.push('http://' + currentUrl + '/' + image.path)
          }
        })
        .catch(() => {
          alert('업로드 중 에러가 발생했습니다')
        })
    },
    async getBoardData () {
      const res = await this.$http.get('/api/board/list')
      const datas = res.data.result.rows
      console.log(datas)
      this.setBoardData(datas)
    },
    setBoardData (datas) {
      for (let data of datas) {
        let boardData = {}
        boardData.name = data.name
        boardData.id = data.id
        this.boardDatas.push(boardData)
      }
    },
    showWriteDialog () {
      if (this.$store.getters.getIsLogin) this.writeView = !this.writeView
      else this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
  .float-plus{
    position: fixed;
    bottom:1.5rem;
    right:1.5rem;
  }
</style>
