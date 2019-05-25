<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container grid-list-lg>
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex
        xs12
        sm8
      >
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">
                {{ title }}
              </h3>
            </div>
          </v-card-title>
          <v-card-text>
            <div>
              <div> 브랜드 {{ brand }} </div>
              <div> 사이즈 {{ size }} </div>
              <div> 신발 상태 {{ shoesStat }} </div>
              <div> 아이디 {{ userId }} </div>
              <div> 글작성 {{ createdAt }} </div>
              <div> 마지막 수정 {{ updatedAt }} </div>
            </div>
          </v-card-text>
          <v-img
            v-for="(image,i) in images"
            :key="i"
            class="white--text"
            aspect-ratio="1.7"
            :src="image.img_url"
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
          <v-card-text>
            <p>
              {{ contents }}
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        sm8
      >
        <v-card>
          <v-layout
            row
            wrap
          >
            댓글 수 {{ comments.count }}
            <v-btn
              solo
              @click="getCommentsData"
            >
              새로고침
            </v-btn>
            <v-btn
              solo
              @click="goBack"
            >
              목록
            </v-btn>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        sm8
      >
        <v-layout
          row
          wrap
        >
          <ul>
            <li
              v-for="(comment,i) in comments.data"
              :key="i"
            >
              <div>
                내용 : {{ comment.contents }}
              </div>
              <div>
                작성자 : {{ comment.user_id }}
              </div>
            </li>
          </ul>
        </v-layout>
      </v-flex>
      <v-flex
        xs12
        sm8
      >
        <v-card>
          <v-layout
            comlumn
            wrap
          >
            <v-textarea
              v-model="comments.myText"
              name="comment"
              placeholder="내용을 입력하세요"
            />
            <v-layout row>
              <v-btn @click="sendComments">
                전송
              </v-btn>
            </v-layout>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  name: 'BoardView',
  data () {
    return {
      title: '',
      images: [],
      contents: '',
      brand: '',
      userId: '',
      createdAt: '',
      updatedAt: '',
      size: '',
      shoesStat: '',
      comments: {
        count: 0,
        data: [],
        myText: ''
      }
    }
  },
  mounted: function () {
    this.getViewData()
    this.getCommentsData()
  },
  methods: {
    getViewData () {
      this.$http.get('/api/board/view/' + this.$route.params.id)
        .then((response) => {
          this.images = response.data.images
          const viewData = response.data.boardViewData
          this.title = viewData.title
          this.contents = viewData.contents
          this.brand = viewData.brand_code
          this.userId = viewData.user_id
          this.size = viewData.size
          this.createdAt = viewData.createdAt
          this.updatedAt = viewData.updatedAt
          this.shoesStat = viewData.shoes_status
        })
    },
    getCommentsData () {
      this.$http.get('/api/board/comments/' + this.$route.params.id)
        .then((response) => {
          this.comments.count = response.data.result.count
          this.comments.data = response.data.result.rows
        })
    },
    goBack () {
      this.$router.go(-1)
    },
    sendComments () {
      this.$http.post('/api/board/comments/' + this.$route.params.id, {
        userId: null,
        data: this.comments.myText
      })
        .then((response) => {
          this.getCommentsData()
          this.comments.myText = ''
        })
    },
    updateCheck () {
      this.$http.put('/api/board/comments/' + this.$route.params.id, {
        userId: null,
        data: this.comments.myText
      })
        .then((response) => {
          this.getCommentsData()
          this.comments.myText = ''
        })
    }
  }
}
</script>

<style scoped>

</style>
