const BlockPage = () => import('./Index.vue')
const BlockDetailsPage = () => import('./BlockDetails.vue')
const BlockRoute = {
  path: '/block',
  name: 'block',
  component: BlockPage
}
const BlockDetailsRouter = {
  path: '/block/:paramsValue',
  name: 'blockDetails',
  component: BlockDetailsPage
}

export { BlockRoute, BlockDetailsRouter }
