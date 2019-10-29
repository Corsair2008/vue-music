import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    }, {
      path: '/recommend',
      name: 'Recommend',
      component: () => import('@/components/recommend/recommend'),
      children: [
        {
          path: ':id',
          name: 'Disc',
          component: () => import('@/components/music-list/music-list')
        }
      ]
    }, {
      path: '/search',
      name: 'Search',
      component: () => import('@/components/search/search')
    }, {
      path: '/singer',
      name: 'Singer',
      component: () => import('@/components/singer/singer'),
      children: [
        {
          path: ':id',
          name: 'SingerDetail',
          component: () => import('@/components/singer-detail/singer-detail')
        }
      ]
    }, {
      path: '/rank',
      name: 'Rank',
      component: () => import('@/components/rank/rank')
    }
  ]
})
