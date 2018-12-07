/**
** @Description: Author Message
** @author huyangyang
** @date 2018/10/23
**/

const AssetPage = () => import('./Index.vue')
const AssetDetailsPage = () => import('./AssetDetails.vue')

const AssetRoute = {
  path: '/assets',
  name: 'assets',
  component: AssetPage
}

const AssetDetailsRoute = {
  path: '/assets/:propertyId',
  name: 'assetDetails',
  component: AssetDetailsPage
}
export { AssetRoute, AssetDetailsRoute }
