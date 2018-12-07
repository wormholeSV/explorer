const AddressDetailsPage = () => import('./AddressDetails.vue')
const AddressPropertyList = () => import('./AddressPropertyList.vue')
const AddressDetailsRoute = {
  path: '/address/:address',
  name: 'addressDetails',
  component: AddressDetailsPage
}

const AddressPropertyRoute = {
  path: '/address/:address/property/:propertyId',
  name: 'addressProperty',
  component: AddressPropertyList
}

export { AddressDetailsRoute, AddressPropertyRoute }
