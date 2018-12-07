/**
** @Description: Author Message
** @author huyangyang
** @date 2018/10/23
**/

const homePage = () => import('./Index.vue')

const routes = {
  path: '/home',
  name: 'home',
  component: homePage
}

export default routes
