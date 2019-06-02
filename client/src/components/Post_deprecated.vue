<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-layout
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
        px-2
        my-3
      >
        <span class="subheading font-weight-bold">
          {{ postData.user_nickname }}
        </span>
        <div class="caption grey--text">
          {{ fn_dateTimeToFormatted(postData.createdAt) }}
        </div>
        <div class="title mt-2 mb-1 font-weight-bold">
          {{ postData.subject }}
        </div>
        <div class="mt-3 px-2">
          <v-img
            v-for="(image,i) in images"
            :key="i"
            :src="image.img_url"
            :lazy-src="image.img_url"
            contain
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
                  color="primary"
                />
              </v-layout>
            </template>
          </v-img>
        </div>
        <div style="white-space: pre-line;">
          {{ postData.contents }}
        </div>
      </v-flex>
      <v-flex
        xs12
        md8
        px-2
        py-2
      >
        <v-divider />
      </v-flex>
      <v-flex
        xs12
        md8
        px-2
      >
        <v-list dense v-if="comments.data.length > 0">
          <template v-for="(comment, index) in comments.data">
            <v-divider
              v-if="index !== 0"
              :key="`divider-${index}`"
            />
            <v-list-tile
              :key="index"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ comment.contents }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ comment.user_nickname }}
                  <span class="grey--text">
                    {{ '    ' + fn_dateTimeToFormatted(comment.createdAt) }}
                  </span>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
      <v-flex
        v-if="$store.getters.getIsLogin"
        xs12
        md6
        px-2
        mt-2
      >
        <v-text-field
          v-model="comments.myText"
          full-width
          box
          label="댓글을 입력하세요"
          append-icon="send"
          @click:append="sendComments"
          @keypress.enter.prevent="sendComments"
        />
      </v-flex>
      <v-flex
        v-else
        xs12
        md6
        px-2
        mt-2
      >
        <v-text-field
          full-width
          box
          value="댓글을 달려면 로그인하세요"
          readonly
          append-icon="send"
          @click="$router.push('/login')"
          @click:append="sendComments"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Post',
  data: () => ({
    postData: {},
    images: [],
    commentList: [],
    progressCircle: true,
    comments: {
      count: 0,
      data: [],
      myText: ''
    }
  }),
  computed: {
  },
  async created () {
    try {
      const res = await this.getPost()
      this.setPost(res)
      this.progressCircle = false
      const commentRes = await this.getCommentData()
      this.setCommentData(commentRes)
    } catch (e) {
      if (e.response.status === 401) this.$router.push('/login?requirePage=true')
      else {
        alert('에러 발생')
        this.$router.push('/')
      }
    }
  },
  methods: {
    async getPost () {
      const res = this.$http.get('/api/board/view/' + this.$route.params.postId)
      return res
    },
    setPost (res) {
      this.images = res.data.images
      this.postData = res.data.boardViewData
    },
    async getCommentData () {
      const res = await this.$http.get('/api/board/comments/' + this.$route.params.postId)
      return res
    },
    setCommentData (res) {
      this.comments.count = res.data.result.count
      this.comments.data = res.data.result.rows
    },
    async sendComments () {
      const response = await this.$http.post('/api/board/comments/' + this.$route.params.postId, {
        data: this.comments.myText
      })
      const res = await this.getCommentData()
      this.setCommentData(res)
      this.comments.myText = ''
    },
    fn_dateTimeToFormatted (dt) {
      let min = 60 * 1000
      let c = new Date()
      let d = new Date(dt)
      let minsAgo = Math.floor((c - d) / (min))

      let result = {
        'raw': d.getFullYear() + '-' + (d.getMonth() + 1 > 9 ? '' : '0') + (d.getMonth() + 1) + '-' + (d.getDate() > 9 ? '' : '0') + d.getDate() + ' ' + (d.getHours() > 9 ? '' : '0') + d.getHours() + ':' + (d.getMinutes() > 9 ? '' : '0') + d.getMinutes() + ':' + (d.getSeconds() > 9 ? '' : '0') + d.getSeconds(),
        'formatted': ''
      }
      if (minsAgo < 1) {
        result.formatted = '방금'
      } else if (minsAgo < 60) { // 1시간 내
        result.formatted = minsAgo + '분 전'
      } else if (minsAgo < 60 * 24) { // 하루 내
        result.formatted = Math.floor(minsAgo / 60) + '시간 전'
      } else { // 하루 이상
        result.formatted = Math.floor(minsAgo / 60 / 24) + '일 전'
      }

      return result.formatted
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
