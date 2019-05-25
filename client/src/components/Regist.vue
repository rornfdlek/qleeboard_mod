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
              <span class="title mt-2">회원가입</span>
            </v-card-title>
          </v-layout>
          <v-card-text class="px-4 pb-0">
            <v-text-field
              v-model="regEmail"
              label="이메일"
              :rules="[rules.email]"
              required
            />
            <v-text-field
              v-model="regNickname"
              label="닉네임"
              :rules="[rules.required]"
              required
            />
            <v-text-field
              v-model="regPassword"
              label="비밀번호"
              type="password"
              :rules="[rules.required]"
              required
            />
            <v-text-field
              v-model="regPasswordConfirm"
              label="비밀번호 확인"
              type="password"
              :rules="[rules.required]"
              required
            />
          </v-card-text>
          <v-layout
            column
            class="px-3"
          >
            <v-btn
              class="my-0"
              dark
              color="primary"
              @click="RegistUser"
            >
              회원가입
            </v-btn>
            <div
              class="subheading my-3"
              style="text-align: center"
            >
              가입 버튼을 누르면 <br>이용약관이 동의 처리됩니다.
            </div>
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
  </v-container>
</template>

<script>
export default {
  name: 'Regist',
  data: () => ({
    regEmail: '',
    regPassword: '',
    regPasswordConfirm: '',
    regNickname: '',
    rules: {
      required: value => !!value || '필수 입력 값입니다',
      counter: value => value.length <= 20 || 'Max 20 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || '유효하지 않은 이메일입니다'
      }
    }
  }),
  methods: {
    RegistUser: function () {
      if (!this.rules.email(this.regEmail) || this.rules.email(this.regEmail) === '유효하지 않은 이메일입니다') {
        alert('올바른 이메일을 입력해주세요')
        return
      }
      if (this.regPassword !== this.regPasswordConfirm) {
        alert('비밀번호를 일치 시켜주세요')
        return
      }
      if (this.regNickname === '') {
        alert('닉네임을 입력하세요')
        return
      }
      if (this.regPassword === '') {
        alert('비밀번호를 입력하세요')
        return
      }
      this.$http.post(`/api/sign/up`, {
        email_address: this.regEmail,
        password: this.regPassword,
        user_nickname: this.regNickname
      })
        .then((result) => {
          this.regEmail = ''
          this.regPassword = ''
          this.regPasswordConfirm = ''
          this.regNickname = ''
          this.setLogin(result)
        })
        .catch(() => {
          alert('등록에 실패하였습니다.')
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
      this.$router.go(-2)
    }
  }
}
</script>

<style scoped>
</style>
