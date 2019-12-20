import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home',
    component: Home,
    redirect: '/welcome',
    /* 注意！！！children千万不要有大写 */
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users }
    ] }
]

const router = new VueRouter({
  routes
})
// 挂载导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪来
  // next 是一个函数 ，放行和强制跳转
  // next() 放行  next() 强制跳转
  if (to.path === '/login') return next()
  const username = window.sessionStorage.getItem('username')
  if (!username) return next('/home')
  next()
})
export default router
