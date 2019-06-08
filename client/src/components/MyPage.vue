<template>
  <v-container class="mb-5 px-0">
    <v-layout
      wrap
      row
      justify-center
    >
      <v-flex
        xs12
        md8
        px-0
      >
        <v-card
          mb-3
        >
          <v-card-title class="pa-1 pl-3 pt-3 subheading font-weight-bold primary--text">
            {{ userNickname }}
          </v-card-title>
          <v-card-text class="pa-1 pl-3 pb-3 caption">
            {{ userEmail }}
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        xs12
        md8
        my-2
        px-0
      >
        <v-card
          my-3
        >
          <v-list>
            <v-subheader>
              계정
            </v-subheader>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title
                  class="body-2"
                  @click="changeNickDialog = true"
                >
                  닉네임 변경
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title
                  class="body-2"
                  @click="changePasswordDialog = true"
                >
                  비밀번호 변경
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title
                  class="body-2"
                  @click="logOut"
                >
                  로그아웃
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title
                class="body-2"
                @click="deleteUserDialog = true"
              >
                회원 탈퇴
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="changeNickDialog"
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
            v-model="customNickname"
            :label="userNickname"
          />
          <v-alert
            :value="duplicatedNickname"
            type="error"
          >
            이미 있는 닉네임입니다
          </v-alert>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            @click="changeNickDialog = false"
          >
            취소
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="changeNickname"
          >
            변경
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="deleteUserDialog"
    >
      <v-card>
        <v-card-title
          class="title"
          primary-title
        >
          회원 탈퇴
        </v-card-title>
        <v-card-text>
          탈퇴시 되돌릴 수 없습니다. 그래도 계속하시겠습니까?
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            @click="deleteUserDialog = false"
          >
            취소
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="deleteUser"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="changePasswordDialog"
    >
      <v-card>
        <v-card-title
          class="title"
          primary-title
        >
          비밀번호 변경
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="myPassword"
            label="현재 비밀번호"
          />
          <v-text-field
            v-model="customPassword"
            label="변경 비밀번호"
          />
          <v-alert
            :value="wrongCurrentPassword"
            type="error"
          >
            현재 비밀번호가 틀렸습니다
          </v-alert>
          <v-alert
            :value="successChangePassword"
            type="success"
          >
            비밀 번호 변경에 성공했습니다
          </v-alert>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            @click="changePasswordDialog = false"
          >
            취소
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="changePassword"
          >
            변경
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    changeNickDialog: false,
    customNickname: '',
    deleteUserDialog: false,
    duplicatedNickname: false,
    wrongCurrentPassword: false,
    changePasswordDialog: false,
    successChangePassword: false,
    myPassword: '',
    customPassword: ''
  }),
  computed: {
    userNickname () {
      return this.$store.getters.getUserNickname
    },
    userEmail () {
      return this.$store.getters.getUserEmail
    }
  },
  created () {

  },
  methods: {
    logOut () {
      this.$store.commit('delUser')
      localStorage.removeItem('QLee_token')
      this.$http.defaults.headers.common['x-access-qlee-token'] = ''
      this.$router.push('/')
    },
    async changePassword () {
      try {
        const result = await this.$http.put('/api/auth/password', { currentPassword: this.myPassword, changePassword: this.customPassword })
        if (result.status === 205) {
          this.wrongCurrentPassword = true
          await setTimeout(() => { this.wrongCurrentPassword = false }, 3000)
          return
        } else {
          this.successChangePassword = true
          await setTimeout(() => {
            this.successChangePassword = false
            this.changePasswordDialog = false
          }, 2000)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async changeNickname () {
      try {
        if (this.customNickname === this.userNickname) {
          this.changeNickDialog = false
          return
        }
        const changeNickresult = await this.$http.post('/api/auth/nickname', {
          changeNickname: this.customNickname
        })
        if (changeNickresult.status === 205) {
          this.duplicatedNickname = true
          await setTimeout(() => { this.duplicatedNickname = false }, 3000)
          return
        }
        const result = await this.$http.post('/api/sign/jwt')
        localStorage.setItem('QLee_token', result.data.token)
        const userData = {
          userEmail: result.data.email_address,
          userNickname: result.data.user_nickname,
          mod: result.data.mod
        }
        this.$http.defaults.headers.common['x-access-qlee-token'] = localStorage.getItem('QLee_token')
        this.$store.commit('Login', userData)
        this.changeNickDialog = false
      } catch (e) {
        alert('에러가 발생했습니다')
      }
    },
    async deleteUser () {
      try {
        const result = await this.$http.delete('/api/sign/out')
        localStorage.removeItem('QLee_token')
        window.location.href = '/'
      } catch (e) {
        alert('탈퇴에 실패했습ㄴ디ㅏ')
      }
    }
  }
}
</script>

<style>

</style>
