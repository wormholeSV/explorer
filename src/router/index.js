import Vue from 'vue'
import Router from 'vue-router'
import HomeRoute from '../containers/homePage/route'
import { BlockRoute, BlockDetailsRouter } from '../containers/block/route'
import { AssetRoute, AssetDetailsRoute } from '../containers/assets/route'
import { AddressDetailsRoute, AddressPropertyRoute } from '../containers/address/route'
import { BurnListRoute } from '../containers/burn/route'
import { TxhashDetailsRoute } from '../containers/txHash/route'
Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/home' }
  ]
})

router.addRoutes([{ ...HomeRoute }, { ...AssetRoute }, { ...BlockRoute }, { ...AssetDetailsRoute }, { ...BlockDetailsRouter }, { ...AddressDetailsRoute }, { ...BurnListRoute }, { ...TxhashDetailsRoute }, { ...AddressPropertyRoute }])

export default router
