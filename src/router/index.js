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
      component: () => import('recommend/recommend')
    }, {
      path: '/search',
      name: 'Search',
      component: () => import('search/search')
    }, {
      path: '/singer',
      name: 'Singer',
      component: () => import('singer/singer')
    }, {
      path: '/rank',
      name: 'Rank',
      component: () => import('rank/rank')
    }, {
      path: '/detail',
      name: 'Detail',
      component: () => import('detail/detail')
    }
  ]
})
