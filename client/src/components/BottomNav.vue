<template>
  <v-bottom-nav
    :active="bottomNavValue"
    :value="true"
    absolute
    fixed
    color="transparent"
  >
    <v-btn
      color="primary"
      flat
      value="main"
      @click="goPage('/')"
    >
      <v-icon>home</v-icon>
    </v-btn>

    <v-btn
      color="primary"
      flat
      value="board"
      @click="goPage('/board/list')"
    >
      <v-icon>list</v-icon>
    </v-btn>

    <v-btn
      color="primary"
      flat
      value="mypage"
      @click="goPage('/mypage')"
    >
      <v-icon>person</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
export default {
  props: {
    bottomNav: String
  },
  data () {
    return {
    }
  },
  computed: {
    bottomNavValue () {
      return this.bottomNav ? this.bottomNav : ''
    }
  },
  methods: {
    goPage (page) {
      this.$router.push(page)
    }
  }
}
</script>
