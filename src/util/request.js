/**
 * http request collection
 */
import Vue from 'vue'
export default {
  /**
   * get properties
   */
  getProperties (params) {
    return Vue.axios.get('/explorer/properties', { params })
  },
  /**
   * get block list
   */
  getBlockList (params) {
    if (!params) {
      params = { pageNo: 1, pageSize: 10 }
    }
    return Vue.axios.get('/explorer/block/list', { params })
  },
  /**
   * query asset
   */
  dimQuery (keyword, params) {
    const { pageSize, pageNo } = params
    return Vue.axios.get(`/explorer/properties/query?keyword=${keyword}&pageSize=${pageSize}&pageNo=${pageNo}`)
  },
  /**
   * get owner list
   */
  getOwners (id, params) {
    const { pageSize, pageNo } = params
    return Vue.axios.get(`/explorer/property/${id}/listowners?pageSize=${pageSize}&pageNo=${pageNo}`)
  },
  /**
   * get a property
   */
  getAProperty (params) {
    return Vue.axios.get(`/explorer/property/${params}`)
  },
  getBlockDetails (params) {
    return Vue.axios.get(`/explorer/block/block/${params}`)
  },
  /**
   * get change history of property
   */
  getChangeRecords (propertyId, params) {
    return Vue.axios.get(`/explorer/property/${propertyId}/history`, { params })
  },
  /**
   * get transfer history of property
   */
  getTransferRecords (propertyId, params) {
    return Vue.axios.get(`/explorer/property/${propertyId}/txs`, { params })
  },
  /**
   * get survey info of property
   */
  getSurveyInfo () {
    return Vue.axios.get(`/explorer/info`)
  },
  /**
   * get transfer history of property
   */
  getWhcSummary () {
    return Vue.axios.get(`/explorer/burn/summary`)
  },
  /**
   * get transfer burning
   */
  getBurningWHC (params) {
    if (!params) {
      params = { pageNo: 1, pageSize: 10 }
    }
    return Vue.axios.get(`/explorer/burn/list`, { params })
  },
  /**
   * get a week  Wormhole transcations
   */
  getWeekWormhole () {
    // let timeOffset = (new Date()).getTimezoneOffset() + ''
    let url = `/explorer/tx/latest?timeOffset=0`
    return Vue.axios.get(url)
  },
  /**
   * get wormhole transaction list
   * @param {} params
   */
  getWhcTransactionList (params) {
    return Vue.axios.get('/explorer/tx/list', { params })
  },
  /**
   * get address details
   */
  getAddressDetails (params) {
    return Vue.axios.get(`/explorer/address/${params}`)
  },
  getTransactionListByAddress (address, params) {
    return Vue.axios.get(`/explorer/address/${address}/txs`, { params })
  },
  getBurnInfo () {
    return Vue.axios.get('/explorer/burn/summary')
  },
  getBurnList (params) {
    return Vue.axios.get('/explorer/burn/list', { params })
  },
  getTxHashDetails (params) {
    return Vue.axios.get(`/explorer/tx/hash/${params}`)
  },
  getPropertiesByAddress (address, params) {
    return Vue.axios.get(`/explorer/address/${address}/properties`, { params })
  },
  getTxsByAddressAndProperty (address, propertyId, params) {
    return Vue.axios.get(`/explorer/address/${address}/property/${propertyId}/txs`, { params })
  }
}
