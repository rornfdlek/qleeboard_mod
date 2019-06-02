import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main'
import BoardList from '@/views/BoardList'
import Board from '@/views/Board'
import Post from '@/views/Post'
import MyPage from '@/views/MyPage'
import Login from '@/views/Login'
import Regist from '@/views/Regist'
import Admin from '@/views/AdminMain'
import AdminLogin from '@/views/AdminLogin'
import NotFound from '@/views/NotFound'
import store from '@/store'

const requireAuth = () => (from, to, next) => {
  if (store.getters.getIsLogin) return next() // isAuth === true면 페이지 이동
  else next('/login') // isAuth === false면 다시 로그인 화면으로 이동
}

const notRequireAuth = () => (from, to, next) => {
  if (!store.getters.getIsLogin) return next() // isAuth === true면 페이지 이동
  else next('/mypage') // isAuth === false면 다시 로그인 화면으로 이동
}

const requireAdmin = () => (from, to, next) => {
  if (store.getters.getMod === 1) return next() // isAuth === true면 페이지 이동
  else if (store.getters.getMod === 2) next('/admin/login') // isAuth === false면 다시 로그인 화면으로 이동
  else next('/login')
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/board/list',
      name: 'BoardList',
      component: BoardList
    },
    {
      path: '/board/:id',
      name: 'Board',
      component: Board
    },
    {
      path: '/board/:boardId/:postId',
      name: 'Post',
      component: Post
    },
    {
      path: '/mypage',
      name: 'MyPage',
      component: MyPage,
      beforeEnter: requireAuth()
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: notRequireAuth()
    },
    {
      path: '/regist',
      name: 'Regist',
      component: Regist,
      beforeEnter: notRequireAuth()
    },
    {
      path: '/admin',
      name: 'AdminMain',
      component: Admin,
      beforeEnter: requireAdmin()
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: AdminLogin
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    { path: '*', component: NotFound } // 404 not found
  ]
})
