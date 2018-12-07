<template lang="pug">
    div.tab-container
        el-tabs(v-model="activeName" @tab-click="handleClick")
            el-tab-pane(name="first")
                span(slot="label")
                    i.el-icon-sold-out
                    span.table-title-text {{$t('asset.changeRecords')}}
                el-table(
                v-loading="loading"
                :data="changingData"
                stripe
                style="width: 100%"
                :header-cell-style="rowClass"
                )
                    el-table-column(width="200" prop="blockTime" :label="$t('asset.blockTime')" show-overflow-tooltip)
                    el-table-column(width="420" prop="txType" :label="$t('asset.Type')" show-overflow-tooltip)
                    el-table-column(:label="$t('asset.txHash')" show-overflow-tooltip)
                        template(slot-scope="scope")
                            div(@click="jumpToHash(scope.row.txHash)").apostrophe
                                span.click-pointer {{scope.row.txHash}}
                div(style="height: 25px")
                div.page-style
                    el-pagination(
                    background
                    layout="prev, pager, next,jumper"
                    :total="movePage.total"
                    :page-size="movePage.pageSize"
                    :current-page="movePage.currentPage"
                    @current-change="changeMovePage"
                    )
            el-tab-pane(name="second")
                span(slot="label")
                    i.el-icon-refresh
                    span.table-title-text {{$t('asset.transferRecords')}}
                el-table(
                v-loading="transferLoading"
                :data="transferData"
                stripe
                style="width: 100%"
                :header-cell-style="rowClass"
                )
                    el-table-column(prop="blocktime" :label="$t('asset.blockTime')" show-overflow-tooltip)
                    el-table-column(:label="$t('asset.txHash')" show-overflow-tooltip)
                        template(slot-scope="scope")
                            div(@click="jumpToHash(scope.row.txid)").apostrophe
                                span.click-pointer {{scope.row.txid}}
                    el-table-column(:label="$t('asset.from')" show-overflow-tooltip)
                        template(slot-scope="scope")
                            div(@click="goToAddress(scope.row.sendingaddress)").apostrophe
                                span.click-pointer {{scope.row.sendingaddress}}
                    el-table-column(:label="$t('asset.to')" show-overflow-tooltip)
                        template(slot-scope="scope")
                            div(@click="goToAddress(scope.row.referenceaddress)").apostrophe
                                span.click-pointer {{scope.row.referenceaddress}}
                    el-table-column(prop="amount" :label="$t('asset.amount')" show-overflow-tooltip)
                    el-table-column(prop="type_int" :label="$t('asset.Type')" show-overflow-tooltip)
                div(style="height: 25px")
                div.page-style
                    el-pagination(
                    background
                    layout="prev, pager, next,jumper"
                    :total="transferPage.total"
                    :page-size="transferPage.pageSize"
                    :current-page="transferPage.currentPage"
                    @current-change="changeTransferPage"
                    )
            el-tab-pane(name="third")
                span(slot="label")
                    i.el-icon-tickets
                    span.table-title-text {{$t('asset.owners')}}
                el-table(
                v-loading="ownerLoading"
                :data="ownersData"
                stripe
                style="width: 100%"
                :header-cell-style="rowClass"
                )
                    el-table-column(:label="$t('asset.ownersAddress')" show-overflow-tooltip)
                        template(slot-scope="scope")
                            div(@click="goToAddress(scope.row.Address)").apostrophe
                                span.click-pointer {{scope.row.Address}}
                    el-table-column(width="200" prop="balance_available" :label="$t('asset.ownersAmount')" show-overflow-tooltip)
                    el-table-column(width="420" prop="Status" :label="$t('asset.ownersStatus')" show-overflow-tooltip)
                div(style="height: 25px")
                div.page-style
                    el-pagination(
                    background
                    layout="prev, pager, next,jumper"
                    :total="ownerPage.total"
                    :page-size="ownerPage.pageSize"
                    :current-page="ownerPage.currentPage"
                    @current-change="changeOwnPage"
                    )
</template>

<script>
import request from '../../../util/request'
import popup from '../../../util/notice'
import { format, transformType, translateTransferType, jumpToTxHash, jumpToAddress } from '../../../util/transform'

const { getChangeRecords, getTransferRecords, getOwners } = request
export default {
  data () {
    return {
      loading: false,
      transferLoading: false,
      ownerLoading: false,
      changingData: [],
      transferData: [],
      ownersData: [],
      activeName: 'first',
      movePage: {
        currentPage: 1,
        total: 0,
        pageSize: 15
      },
      transferPage: {
        currentPage: 1,
        total: 0,
        pageSize: 15
      },
      ownerPage: {
        currentPage: 1,
        total: 0,
        pageSize: 15
      }
    }
  },
  methods: {
    rowClass () {
      return {
        color: '#0a1f44'
      }
    },
    getChangeData (pageNo = 1, pageSize = 15) {
      let { propertyId } = this.$route.params
      let params = { pageNo, pageSize }
      this.loading = true
      getChangeRecords(propertyId, params).then((data) => {
        this.loading = false
        let { result } = data
        let totalNum = result.total
        this.movePage.total = totalNum
        if (data.code === 0) {
          this.changingData = result.list.map((item) => {
            item.txType = transformType(item.txType)
            item.blockTime = format(item.blockTime)
            return item
          })
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.loading = false
        popup.error(error, this)
      })
    },
    getTransferData (pageNo = 1, pageSize = 15) {
      let { propertyId } = this.$route.params
      let params = { pageNo, pageSize }
      this.transferLoading = true
      getTransferRecords(propertyId, params).then((data) => {
        this.transferLoading = false
        let { result } = data
        let totalNum = result.total
        this.transferPage.total = totalNum
        if (data.code === 0) {
          this.transferData = result.list.map((item) => {
            item.type_int = translateTransferType(item.type_int)
            item.blocktime = format(item.blocktime)
            return item
          })
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.transferLoading = false
        popup.error(error, this)
      })
    },
    getOwnersData (pageNo = 1, pageSize = 15) {
      let { propertyId } = this.$route.params
      let params = { pageNo, pageSize }
      this.ownerLoading = true
      getOwners(propertyId, params).then((data) => {
        this.ownerLoading = false
        let { result } = data
        let totalNum = result.total
        this.ownerPage.total = totalNum
        if (data.code === 0) {
          this.ownersData = result.list.map((item) => {
            item.Status = item.Status ? 'Frozen' : 'Confirm'
            return item
          })
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.transferLoading = false
        popup.error(error, this)
      })
    },
    jumpToHash (hash) {
      jumpToTxHash(hash, this)
    },
    goToAddress (address) {
      jumpToAddress(address, this)
    },
    changeMovePage (page) {
      this.getChangeData(page)
    },
    changeTransferPage (page) {
      this.getTransferData(page)
    },
    changeOwnPage (page) {
      this.getOwnersData(page)
    },
    handleClick () {
      if (this.activeName === 'first') {
        return false
      } else if (this.activeName === 'second' && this.transferData.length === 0) {
        this.getTransferData()
      } else if (this.activeName === 'third' && this.ownersData.length === 0) {
        this.getOwnersData()
      }
    }
  },
  activated () {
    this.getChangeData()
  }
}
</script>

<style lang="scss" scoped>
    .tab-container {
        max-width: 1216px;
        margin: 40px auto 0;
        .apostrophe {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .el-icon-refresh{
            font-size: 20px;
        }
        .el-icon-sold-out {
            font-size: 20px;
        }
        .el-icon-tickets {
            font-size: 20px;
        }
        .table-title-text {
            font-size: 20px;
            font-weight: 500;
            margin-left: 10px;
        }
    }
    .page-style {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
</style>
