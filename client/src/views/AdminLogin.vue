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
        <div>관리자 회원가입</div>
      </v-layout>
    </v-toolbar>
    <v-content>
      <v-container style="height:100%">
        <v-layout
          justify-center
          align-center
          row
          style="height:100%"
        >
          <v-text-field
            v-model="adminPassword"
            box
            type="password"
            label="관리자 비밀번호를 입력하세요"
            append-icon="send"
            @click:append="adminLogin"
            @keypress.enter.prevent="adminLogin"
          />
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'AdminLogin',
  data: () => ({
    adminPassword: ''
  }),
  methods: {
    async adminLogin () {
      const result = await this.$http.post('/api/admin/up', { admin_password: this.adminPassword })
      localStorage.setItem('QLee_token', result.data.token)
      const userData = {
        userEmail: result.data.email_address,
        userNickname: result.data.user_nickname,
        userSrl: result.data.user_srl,
        mod: result.data.mod
      }
      this.$http.defaults.headers.common['x-access-qlee-token'] = localStorage.getItem('QLee_token')
      this.$store.commit('Login', userData)
      this.$router.push('/admin')
    }
  }
}
</script>

<style scoped>

</style>
