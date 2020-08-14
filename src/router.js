import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect:'/recommend'
    },
    {
      path: '/login',
      name: 'login',
      components: () => import('./views/Login.vue')
    },
    {
      path: '/recommend',
      name: 'recommend',
      //meta:{requireAuth: true},
      component: () => import('./components/recommend/Recommend.vue'),
      children:[
        {
          path:':id',
          name:'disc',
          meta:{requireAuth: true},
          component:() => import('./components/recommend/disc.vue')
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      //meta:{requireAuth: true},
      component: () => import('./components/singer/Singer.vue'),
      children:[
        {
          path:':id',
          name:'singerDetail',
          meta:{requireAuth: true},
          component: () => import('./components/singer/Singer-detail.vue')
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      //meta:{requireAuth: true},
      component: () => import('./components/rank/Rank.vue'),
      children:[
        {
          path:':id',
          name:'topList',
          meta:{requireAuth: true},
          component: () => import('./components/rank/rank-list.vue')
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      //meta:{requireAuth: true},
      component: () => import('./components/search/Search.vue')
    },
    {
      path:'/user',
      name:'user',
      meta:{requireAuth: true},
      component: () => import('./components/user-center/user-center.vue')
    }
  ]
})
