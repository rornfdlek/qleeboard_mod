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
      <v-container>
        <v-layout justify-center align-center row>
          <input type="text" />
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
