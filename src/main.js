import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from './store'
import fastclick from 'fastclick'
import './common/stylus/index.styl'
import 'amfe-flexible'
import VueLazyload from 'vue-lazyload'

fastclick.attach(document.body)

Vue.config.productionTip = false
Vue.prototype.axios = axios

//解决Vue报错重复点击的问题
import Router from 'vue-router'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//axios请求拦截器
axios.interceptors.request.use(config => {
  //发请求前做什么
  if (window.sessionStorage.getItem('token')) {
  	//给请求头加上token
  	config.headers.token = window.localStorage.getItem('token')
  }
  return config
},error => {
  //请求出错时做什么(基本固定写法)
  return Promise.reject(error)
})

//axios响应拦截器
axios.interceptors.response.use(response => {
  //响应之前做什么
  if (response.data.isLogin && !response.data.isLogin) {
  	//未登录
  	store.commit('setToken','')
    window.localStorage.removeItem('token')
    router.replace({path:'/login'})
  }
  return response
},error => {
  //响应出错时做什么(基本固定写法)
  return Promise.reject(error)
})

//路由守卫(所有路由刷新或者跳转首先经过该方法)
router.beforeEach((to,from,next)=>{
  //需要登录才可见
  if (to.meta.requireAuth) {
       if (window.localStorage.getItem('token')) {
          next()
       }else {
          next({
            path:'/login',
            query:{
              redirect:to.fullPath
            }
          })
       }
  }
  else {
    next()
  }
});

//使用图片懒加载插件
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: './common/image/default.png',
  attempt: 1
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
