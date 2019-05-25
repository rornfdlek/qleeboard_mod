<template>
  <v-container pa-0>
    <v-layout
      row
      align-center
      justify-center
    >
      <v-flex
        xs12
        md6
      >
        <v-card>
          <v-layout
            align-center
            justify-center
            column
          >
            <v-card-title>
              <span class="title mt-2">로그인</span>
            </v-card-title>
          </v-layout>
          <v-card-text class="px-4 pb-0">
            <v-text-field
              v-model="loginEmail"
              label="이메일"
              required
            />
            <v-text-field
              v-model="loginPassword"
              label="비밀번호"
              type="password"
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="#3c3c3c"
              flat
              @click="findPasswordDialog = true"
            >
              암호를 잊으셨나요?
            </v-btn>
          </v-card-actions>
          <v-layout
            column
            class="px-3"
          >
            <v-btn
              class="my-0"
              dark
              color="primary"
              @click="Login"
            >
              로그인
            </v-btn>
            <v-btn
              class="mt-0 mb-3"
              color="black"
              flat
              to="regist"
            >
              회원가입
            </v-btn>
            <v-btn
              class="mt-0 mb-3"
              color="black"
              flat
              @click="goBack"
            >
              취소
            </v-btn>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="findPasswordDialog"
    >
      <v-card>
        <v-card-title
          class="title"
          primary-title
        >
          닉네임 변경
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="findEmail"
            label="가입시 입력한 email을 입력해주세요"
          />
          <v-alert
            :value="sendEmailMessage"
            type="success"
          >
            이메일을 확인해주세요.
          </v-alert>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            @click="findPasswordDialog = false"
          >
            취소
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="sendEmail"
          >
            보내기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    loginEmail: '',
    loginPassword: '',
    findPasswordDialog: false,
    sendEmailMessage: false,
    findEmail: ''
  }),
  methods: {
    Login: function () {
      this.$http.post(`/api/sign/in`, {
        email_address: this.loginEmail,
        password: this.loginPassword
      })
        .then((result) => {
          this.setLogin(result)
        })
        .catch(() => {
          alert('아이디와 비밀번호를 한번 더 확인해주세요')
        })
    },
    setLogin: function (result) {
      localStorage.setItem('QLee_token', result.data.token)
      const userData = {
        userEmail: result.data.email_address,
        userNickname: result.data.user_nickname,
        mod: result.data.mod
      }
      this.$http.defaults.headers.common['x-access-qlee-token'] = localStorage.getItem('QLee_token')
      this.$store.commit('Login', userData)
      this.goBack()
    },
    goBack () {
      if (this.$route.query.requirePage === 'true') this.$router.go(-2)
      else this.$router.go(-1)
    },
    async sendEmail () {
      if (!this.verifyEmaill(this.findEmail)) {
        alert('이메일을 올바르게 입력해주세요')
        return
      }
      try {
        const result = await this.$http.post('/api/auth/password', { email: this.findEmail })
        this.sendEmailMessage = true
        await setTimeout(() => {
          this.sendEmailMessage = false
          this.findEmail = ''
          this.findPasswordDialog = false
        }, 1000)

      } catch (e) {
        alert('에러 발생')
      }
    },
    verifyEmaill () {
      // 이메일 검증 스크립트 작성
      let emailVal = this.findEmail
      let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      // 검증에 사용할 정규식 변수 regExp에 저장
      if (emailVal.match(regExp) != null) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style scoped>
</style>
