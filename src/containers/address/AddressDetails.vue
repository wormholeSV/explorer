<template lang="pug">
    div.address-details-body
        div.head
            div.inner
                span(@click="goBack").click-pointer {{$t('common.back') + ' '}}
                span /
                span {{' ' + address}}
        basic-detail(:addressData="addressData" :address='address')
        address-tabs(:addressForTabs='address')
</template>

<script>
import BasicDetail from './partials/BasicDetail'
import AddressTabs from './partials/AddressTabs'
import request from '../../util/request'
import popup from '../../util/notice'
import { format, TXTYPE } from '../../util/transform'

const { getAddressDetails, getTransactionListByAddress } = request
export default {
  components: { BasicDetail, AddressTabs },
  data () {
    return {
      addressData: {},
      address: '',
      dateValue: '',
      chosenType: 'All',
      tableData: [],
      txType: -1,
      beginTime: '',
      endTime: '',
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      }
    }
  },
  computed: {
    TXTYPE_ALL () {
      return { '-1': 'All', ...TXTYPE }
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getAddressInfo (address) {
      this.$loading()
      getAddressDetails(address).then((data) => {
        this.$loading().close()
        if (data.code === 0) {
          let { result } = data
          this.addressData = result
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.$loading().close()
        popup.error(error, this)
      })
    },
    getListByTime (value) {
      let self = this
      if (value) {
        self.beginTime = Math.floor(value[0] / 1000)
        self.endTime = Math.floor(value[1] / 1000)
      }
      self.getList(1, self.page.pageSize, self.txType, self.beginTime, self.endTime)
      self.page.currentPage = 1
    },
    getType (type, typeOptions) {
      for (let key in typeOptions) {
        if (typeOptions[key] === type) {
          return key
        }
      }
      return -1
    },
    changeType (val) {
      let txType = this.getType(val, this.TXTYPE_ALL)
      this.txType = txType
      let pageSize = this.page.pageSize
      this.getList(1, pageSize, txType, this.beginTime, this.endTime)
      this.page.currentPage = 1
    },
    getList (pageNo = 1, pageSize = 10, txType = -1, beginTime, endTime) {
      let params = { pageNo, pageSize, txType }
      if (beginTime) {
        params.beginTime = beginTime
      }
      if (endTime) {
        params.endTime = endTime
      }
      this.loading = true
      getTransactionListByAddress(this.address, params).then((data) => {
        this.loading = false
        if (data.code === 0) {
          let { result } = data
          let totalNum = result.total
          this.page.total = totalNum
          let resultList = [ ...result.list ]
          for (let i = 0; i < resultList.length; i++) {
            resultList[i].block_time = format(resultList[i].block_time)
          }
          this.tableData = resultList
          window.scrollTo(400, 0)
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.loading = false
        popup.error(error, this)
      })
    },
    changePage (page) {
      this.page.currentPage = page
      this.getList(page, this.page.pageSize, this.txType, this.beginTime, this.endTime)
    },
    jumpToTxHash (value) {
      let params = { txhash: value }
      this.$router.push({ name: 'txDetails', params })
    },
    jumpToAddress (value) {
      let params = { address: value }
      this.$router.push({ name: 'addressDetails', params })
    }
  },
  activated () {
    let { address } = this.$route.params
    this.address = address
    this.getAddressInfo(address)
    this.getList()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss">
.address-details-body{
  max-width: 1216px;
  margin: 0 auto;
  .head {
        display: flex;
        flex-direction: row;
        align-items:flex-start ;
        justify-content: flex-start;
        .inner{
          margin-top: 30px;
        }
  }
  .click-pointer {
        cursor: pointer;
  }
  .line {
        background-color: lightgrey;
        height: 1px;
        margin-top: 10px;
        margin-bottom: 10px;
  }

  .content-body{
    .header-container{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;
      .title-container{
        display: flex;
        align-items: center;
        .icon-transaction{
          display: inline-block;
          width: 24px;
          height: 24px;
          background-image: url('../../../public/img/icon_history.png');
          background-size: contain;
          background-repeat: no-repeat;
        }
        .title-text{
          font-size: 24px;
          color: #0a1f44;
          font-weight: 600;
          margin-left: 15px;
        }
      }
      .search-container{
        display: flex;
        padding-right: 10px;
        .type-container{
          display: inline-block;
          height: 40px;
          margin-left: 20px;
          .search-select{
            height: 40px;
          }
        }
      }
    }
    .content-container{
        .table-container{
          border-radius: 8px;
          padding: 0 8px;
          padding-bottom: 20px;
          .table-item-container{
            width: 100%;
            border-radius: 0 0px 8px 8px;
            box-shadow: 0 10px 11px 0 rgba(96, 131, 191, 0.1), 0 -4px 7px 0 rgba(96, 131, 191, 0.08);
            background-color: #ffffff;
            margin-top: 30px;
            font-size: 14px;
            .item-title-container{
              width: 100%;
              box-sizing: border-box;
              background-color: #DDE1E7;
              padding: 0 30px;
              display: flex;
              flex-direction: row;
              height: 50px;
              align-items: center;
              color: #53627c;
              font-weight: 600;
              border-radius: 8px 8px 0 0;
              .item-container{
                display: flex;
                .txhash{

                }
                &.hash{
                  flex: 4.5;
                }
                &.type{
                  flex:2;
                  justify-content: center;
                }
                &.time{
                  flex:1.5;
                  justify-content: flex-end;
                }
                &.fee-rate{
                  flex:2;
                  justify-content: center;
                }
              }
            }
            .item-content-container{
              box-sizing: border-box;
              width: 100%;
              display: flex;
              justify-content: center;
              margin-top: 26px;
              .item-content-container-inner{
                box-sizing: border-box;
                display: flex;
                width: 100%;
                padding: 0 30px;
                font-size: 16px;
                line-height: 28px;
                .left-container{
                  height: 76px;
                  box-sizing: border-box;
                  width: 506px;
                  padding: 0 40px;
                  background-color: rgba(12, 102, 255, 0.03);
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  .first-container{
                    text-align: left;
                  }
                  .second-container{
                    display: flex;
                    color: #8a94a6;
                    .property{
                    }
                    .amount{
                      margin-right: 10px;
                    }
                  }
                }
                .right-container{
                  box-sizing: border-box;
                  width: 506px;
                  .right-container-inner{
                    width: 100%;
                    box-sizing: border-box;
                    max-height: 248px;
                    overflow: hidden;
                    .right-item-container{
                      width: 100%;
                      box-sizing: border-box;
                      margin-top: 10px;
                      height: 76px;
                      padding: 0 40px;
                      background-color: rgba(12, 102, 255, 0.03);
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      .first-container{
                      text-align: left;
                      }
                      .second-container{
                      display: flex;
                      color: #8a94a6;
                      .property{
                      }
                      .amount{
                        padding-right: 10px;
                      }
                    }
                    &:first-child{
                      margin-top: 0px;
                    }
                    }
                  }
                }
                .show-more-container{
                    text-align: left;
                    margin-top: 15px;
                }
                .show-more{
                  display: inline-block;
                  padding: 5px 15px;
                  border-radius: 4px;
                  border: solid 1px #0c66ff;
                  background-color: #ffffff;
                  &:hover{
                    opacity: 0.5;
                  }
                }
                .center-container{
                  height: 76px;
                  flex: 1;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  .arrow-icon{
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    background-image: url('../../../public/img/icon_next.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                  }
                }
                .sending-address{
                  width: 470px;
                  color:#337ab7;
                }
                .sending-amount{
                  width: 100px;
                  margin-left: 40px;
                }
                .sending-property-name{
                  width: 120px;
                  margin-left: 40px;
                }
                .receive-address{
                  box-sizing: border-box;
                  width: 470px;
                  max-height: 260px;
                  overflow: hidden;
                  color:#337ab7;;
                  .receive-address-inner{
                    max-height: 225px;
                    overflow: hidden;
                    padding-left: 10px;
                    text-align: left;
                    margin-left: 30px;
                    .receive-address-item{
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    }
                    .receive-address-item-container{
                      width: 100%;
                      line-height: 20px;
                      height: 20px;
                      display: flex;
                      color: black;
                      .receive-address-item-count{
                        width: 120px;
                      }
                      .receive-address-item-token{
                        width: 120px;
                        margin-left: 10px;
                      }
                    }
                  }
                  .receive-address-item{
                    width: 100%;
                    height: 25px;
                    line-height: 25px;
                  }

                }
                .receive-amount{
                    width: 100px;
                    margin-left: 40px;
                }
                .receive-property-name{
                    width: 120px;
                    margin-left: 40px;
                }
                .show-more{
                  margin-top: 10px;
                }
              }
            }
            .item-footer-container{
              display: flex;
              justify-content: flex-end;
              padding:20px 30px 20px 10px;
              font-size: 16px;
              .confirmations{
                display: flex;
                justify-content: flex-end;
                .inner{
                box-sizing: border-box;
                width: 200px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border-radius: 22px 0 0 22px;
                background-color: #f1f2f4;
                color: #0a1f44;
                font-weight: 700;
                margin-left: 20px;
                }
              }
              .fee{
                display: flex;
                justify-content: flex-end;
                .inner{
                box-sizing: border-box;
                width: 200px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                border-radius: 22px 0 0 22px;
                background-color: rgba(12, 102, 255, 0.1);
                color: #0a1f44;
                font-weight: 700;
                }
              }
            }
          }
        }
      }
  }
  .el-input__inner{
    height: 40px;
  }
  .click-item{
      cursor: pointer;
  }
  .click-item:hover{
      color: #0c66ff!important;
  }
  .row-bg{
    justify-content: flex-end;
    padding-bottom: 20px;
  }
  .el-pagination__jump{
    font-size: 14px;
    display: inline!important;
  }
}
</style>
