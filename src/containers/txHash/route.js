const TxhashDetailsPage = () => import('./TxHashDetails.vue')
const TxhashDetailsRoute = {
  path: '/tx/:txhash',
  name: 'txDetails',
  component: TxhashDetailsPage
}
export { TxhashDetailsRoute }
