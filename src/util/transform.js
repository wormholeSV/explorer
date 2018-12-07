import moment from 'moment'
const translateAssetType = (type) => {
  let typeStr = type + ''
  let finalType = ''
  switch (typeStr) {
    case '50':
      finalType = 'Fixed Token'
      break
    case '51':
      finalType = 'Crowdsale Token'
      break
    case '54':
      finalType = 'Manageable Token'
  }
  return finalType
}
const translateTransferType = (type) => {
  let typeStr = type + ''
  let finalType = ''
  switch (typeStr) {
    case '0':
      finalType = 'Simple Send'
      break
    case '1':
      finalType = 'Participate in Crowd Sales'
      break
    case '3':
      finalType = 'Air Drop'
      break
    case '4':
      finalType = 'Send All'
      break
    case '55':
      finalType = 'Grant Token'
  }
  return finalType
}
const TXTYPE = {
  0: 'Assets Sending',
  1: 'Participate Crowdsales',
  3: 'Air Drop',
  4: 'Send All',
  50: 'Create Smart Property',
  51: 'Create Crowdsales',
  53: 'Close Crowdsales',
  54: 'Create Managed Property',
  55: 'Additional Property',
  56: 'Revoke Property',
  68: 'Burn BCH',
  70: 'Change Insuring Address'
}

const ASSETTYPE = {
  50: 'Fixed Token',
  51: 'Crowdsale Token',
  54: 'Manageable Token'
}

const transformType = (TxType) => {
  return TXTYPE[TxType]
}
/**
 *
 * @param {*} value the name of tx
 */
const getTxTypeByName = (value) => {
  for (let key in TXTYPE) {
    if (TXTYPE[key] === value) {
      return key
    }
    return -1
  }
}
/**
 *
 * @param {*} value the type of tx
 */
const getNameByTxType = (value) => {
  return TXTYPE[value]
}

const format = (timeStamp) => {
  // let date = new Date()
  // let offset = date.getTimezoneOffset() * 60000
  // date.setTime(timeStamp * 1000 - offset)
  // let y = date.getFullYear()
  // let m = date.getMonth() + 1
  // m = m < 10 ? ('0' + m) : m
  // let d = date.getDate()
  // d = d < 10 ? ('0' + d) : d
  // let h = date.getHours()
  // h = h < 10 ? ('0' + h) : h
  // let minute = date.getMinutes()
  // let second = date.getSeconds()
  // minute = minute < 10 ? ('0' + minute) : minute
  // second = second < 10 ? ('0' + second) : second
  // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
  return moment.unix(timeStamp).format('YYYY-MM-DD HH:mm:ss')
  // return moment().format()
}

const jumpToAddress = (address, vm) => {
  let params = { address }
  vm.$router.push({ name: 'addressDetails', params })
}
const jumpToBlock = (block, vm) => {
  let params = { paramsValue: block }
  vm.$router.push({ name: 'blockDetails', params })
}
const jumpToTxHash = (txhash, vm) => {
  let params = { txhash }
  vm.$router.push({ name: 'txDetails', params })
}

const jumpToAsset = (propertyId, vm) => {
  let params = { propertyId }
  vm.$router.push({ name: 'assetDetails', params })
}
export { jumpToAsset, jumpToTxHash, jumpToAddress, jumpToBlock, translateAssetType, transformType, translateTransferType, format, getTxTypeByName, getNameByTxType, TXTYPE, ASSETTYPE }
