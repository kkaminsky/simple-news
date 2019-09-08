import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import UserCabinet from './views/UserCabinet.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta:{requiresAuth:false}
    },
    {
      path: '/usercabinet',
      name: 'usercabinet',
      component: UserCabinet,
      meta:{requiresAuth:false}

    }
  ]
})


router.beforeEach((to, from, next) => {
  console.log(to.matched.some(record => record.meta.requiresAuth))
  if(to.matched.some(record => record.meta.requiresAuth))
  {
    if (localStorage.getItem('username') == null) {
      next({
        name: 'home',
      })
    }
    else {
      next()
    }

  }
  else {
    next()
  }
})

export default router
