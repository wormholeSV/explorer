<template lang="pug">
    div.block-details-body
        div.head
            div
                span(@click="goBack").click-pointer {{$t('common.back') + ' '}}
                span /
                span {{' ' + this.paramsValue}}
        div.details-container
            div.title-body
                div.title-container
                    span.block-details-icon
                    span.title-text   {{$t('block.details')}}
            div.content-container
                div.content-item
                    div.row-item
                        div.label {{$t('block.height')}}
                        div(class='desc click-pointer' @click='jumpToBlockHash(true,detailsObj.block_height)')  {{detailsObj.block_height||''}}
                    div.row-item
                        div.label {{$t('block.size')}}
                        div.desc  {{detailsObj.size||''}}
                    div.row-item
                        div.label {{$t('block.difficulty')}}
                        div.desc  {{detailsObj.difficulty||''}}
                    div.row-item
                        div.label {{$t('block.comeOutTime')}}
                        div.desc  {{detailsObj.block_time||''}}
                div.content-item
                    div.row-item
                        div.label {{$t('block.whctransactionsNum')}}
                        div.desc  {{detailsObj.whccount}}
                    div.row-item
                        div.label {{$t('block.transactionsAll')}}
                        div.desc  {{detailsObj.txcount}}
                    div.row-item
                        div.label {{$t('block.confirmations')}}
                        div.desc  {{detailsObj.confirmations||''}}
                    div.row-item
                        div.label {{$t('block.nonce')}}
                        div.desc  {{detailsObj.nonce||''}}
                div.content-item(v-show='detailsObj.fee_rates')
                    div.row-item
                        div.label {{$t('common.minFeeRate')}}
                        div.desc  {{detailsObj.fee_rates  && detailsObj.fee_rates.min_fee_rate}} BCH/KB
                    div.row-item
                        div.label {{$t('common.maxFeeRate')}}
                        div.desc  {{detailsObj.fee_rates  && detailsObj.fee_rates.avg_fee_rate}} BCH/KB
                    div.row-item
                        div.label {{$t('common.avgFeeRate')}}
                        div.desc  {{detailsObj.fee_rates  && detailsObj.fee_rates.max_fee_rate}} BCH/KB
                    div.row-item
            div.content-container
                div.content-item
                    div.row-item
                        div.label {{$t('block.blockHash')}}
                        div.desc
                            el-tooltip(:content="detailsObj.block_hash" placement="top")
                                span {{detailsObj.block_hash||''}}
                    div.row-item
                        div.label {{$t('block.prevBlock')}}
                        div(class='desc click-pointer' @click='jumpToBlockHash(true,detailsObj.prev_block)')
                            el-tooltip(:content="detailsObj.prev_block" placement="top")
                                span {{detailsObj.prev_block||''}}
                div.content-item
                    div.row-item
                        div.label {{$t('block.merkleRoot')}}
                        div.desc
                            el-tooltip(:content="detailsObj.merkleroot" placement="top")
                                span {{detailsObj.merkleroot||''}}
                    div.row-item(v-show='false')
                        div.label {{$t('block.nextBlock')}}
                        div(class='desc click-pointer' @click='jumpToBlockHash(true,detailsObj.nextBlock)')
                            el-tooltip(:content="detailsObj.nextBlock" placement="top")
                                span {{detailsObj.nextBlock||''}}
        div.list-container
            div.title-body
                div.title-container
                    span.whc-list-icon
                    span.title-text   {{$t('common.whcTransactionList')}}
                div
                    el-row
                        el-col()
                            el-select(
                                v-model="chosenType"
                                size="small"
                                @change="changeType"
                                )
                                el-option(
                                    v-for="value in TXTYPE_ALL"
                                    :key="value"
                                    :label="value"
                                    :value="value"
                                    )
            div.content-container
              div.table-container
                  div(class='table-item-container' v-for='item in tableData')
                      div.item-title-container
                          div.item-container.hash
                              span(class='txhash click-item' @click='jumpToTxHash(item.tx_hash)') {{item.tx_hash}}
                          div.item-container.type
                              el-tooltip(:content="$t('block.transactionType')" placement="top")
                                  span {{item.type_str}}
                          div.item-container.fee-rate(v-visible='item.fee_rate')
                              el-tooltip(:content="$t('common.feerate')" placement="top")
                                  span {{item.fee_rate}} BCH
                          div.item-container.time  {{item.block_time}}

                      div.item-content-container
                          div.item-content-container-inner
                              div.left-container(v-visible='item.sending_address')
                                  el-tooltip(:content="item.sending_address" placement="top")
                                      div(class='first-container click-item' @click='jumpToAddress(item.sending_address)') {{item.sending_address}}
                                  div.second-container
                                      div.amount(v-show='item.amount') {{item.amount}}
                                      div.property {{item.sending_property_name}}
                              div.center-container
                                  span.arrow-icon
                              div.right-container
                                  div.right-container-inner
                                      div(v-for='addressItem in item.reference_address' class='right-item-container')
                                          el-tooltip(:content="addressItem.address" placement="top")
                                              div(class='first-container click-item' @click='jumpToAddress(addressItem.address)') {{addressItem.address}}
                                          div.second-container
                                              div.amount(v-show='addressItem.mount||item.amount') {{addressItem.mount||item.amount}}
                                              div.property {{addressItem.property_name||item.property_name}}
                                  div(class='show-more-container' v-if='item.reference_address&&item.reference_address.length>3' )
                                      span(class='show-more click-pointer'  @click='jumpToTxHash(item.tx_hash)')  {{$t('common.showAllAddress')}}
                      div.item-footer-container
                          div(class='fee' v-show='item.whc_fee')
                              div.inner {{item.whc_fee}} WHC
                          div(class='confirmations' v-show='item.confirmations')
                              div.inner {{item.confirmations}} {{$t('block.confirmations')}}
              div(style="height: 20px")
              el-row(type="flex" class="row-bg")
                      el-pagination(
                      background
                      layout="prev, pager, next,jumper"
                      :total="page.total"
                      :page-size="page.pageSize"
                      :current-page="page.currentPage"
                      @current-change="changePage"
                      )
</template>

<script>
import request from '../../util/request'
import popup from '../../util/notice'
import { format, TXTYPE } from '../../util/transform'
const { getBlockDetails, getWhcTransactionList } = request

export default {
  components: {},
  data () {
    return {
      paramsValue: '',
      detailsObj: {},
      tableData: [],
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      chosenType: 'All',
      txType: -1
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
    getBlockInfo (hash) {
      this.$loading()
      getBlockDetails(hash).then(data => {
        this.$loading().close()
        if (data.code === 0) {
          let time = format(data.result.block_time) || ''
          this.detailsObj = data.result
          this.detailsObj.block_time = time
        } else {
          popup.error(data.message, this)
        }
      }).catch(error => {
        this.$loading().close()
        popup.error(error, this)
      })
    },
    changePage (page) {
      this.page.currentPage = page
      this.getList(this.paramsValue, page, this.page.pageSize, this.txType)
    },
    getList (paramsValue, pageNo = 1, pageSize = 10, txType = -1) {
      let params = { pageNo, pageSize }
      paramsValue = paramsValue + ''
      if (paramsValue) {
        // check whether the paramsValue is block height or not
        if (paramsValue.length <= 10 && !isNaN(paramsValue)) {
          params.block_height = paramsValue || this.paramsValue
        } else {
          params.block_hash = paramsValue || this.paramsValue
        }
      }
      // eslint-disable-next-line
      if (txType && txType != -1) {
        params.txType = txType
      }
      this.loading = true
      getWhcTransactionList(params).then((data) => {
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
    jumpToAddress (value) {
      let params = { address: value }
      this.$router.push({ name: 'addressDetails', params })
    },
    jumpToTxHash (value) {
      let params = { txhash: value }
      this.$router.push({ name: 'txDetails', params })
    },
    changeType (val) {
      let txType = this.getType(val, this.TXTYPE_ALL)
      this.txType = txType
      let pageSize = this.page.pageSize
      this.getList(this.paramsValue, 1, pageSize, txType)
      this.page.currentPage = 1
    },
    getType (type, typeOptions) {
      for (let key in typeOptions) {
        if (typeOptions[key] === type) {
          return key
        }
      }
      return -1
    },
    jumpToBlockHash (isPushRouter, value) {
      let params = { paramsValue: value }
      this.$router.push({ name: 'blockDetails', params })
      // if (isPushRouter) {
      //   this.$router.push({ name: 'blockDetails', params })
      // } else {
      //   this.$router.replace({ name: 'blockDetails', params })
      // }
    }
  },
  activated () {
    let { paramsValue } = this.$route.params
    this.paramsValue = paramsValue
    this.getBlockInfo(paramsValue)
    this.getList(paramsValue)
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss">
.block-details-body{
  max-width: 1216px;
  margin: 0 auto;
  div{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .head {
        display: flex;
        flex-direction: row;
        align-items:flex-start ;
        justify-content: flex-start;
        margin-top: 20px;
  }
  .click-pointer {
        color: #0c66ff!important;
        cursor: pointer;
  }
  .title{
      text-align:left;
      font-weight: 900;
      margin-top: 20px;
    }
  .details-container{
    padding: 0 3px;
    .content-container{
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      padding: 36px 50px 0 50px;
      border-radius: 8px;
      box-shadow: 0 10px 11px 0 rgba(96, 131, 191, 0.1), 0 -4px 7px 0 rgba(96, 131, 191, 0.08);
      background-color: #ffffff;
      .content-item{
        display: flex;
        flex-direction: row;
        font-size: 13px;
        box-sizing: border-box;
        margin-bottom: 40px;
        .row-item{
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items:flex-start;
          text-align: left;
          font-size: 16px;
          margin-right: 25px;
          .label{
            width: 100%;
            color: #a6aebc;
            line-height: 35px;
            height: 35px;
          }
          .desc{
            width: 100%;
            line-height: 35px;
            height: 35px;
            border-radius: 2px;
            background-color: rgba(138, 148, 166, 0.03);
            color: #53627c;
            font-weight: 700;
          }
          &:last-child{
          }
        }
        &.second{
          flex: 2;
        }
        &.six{
          flex: 6;
        }
      }
      &:last-child{
        margin-bottom: 30px;
      }
    }
    .title-body{
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      .title-container{
        display: flex;
        align-items: center;
        .block-details-icon{
          display: inline-block;
          width: 24px;
          height: 24px;
          background-image: url('../../../public/img/icon_block_details.png');
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
    }

  }
  .list-container{
    .title-body{
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      .title-container{
        display: flex;
        align-items: center;
        .whc-list-icon{
          display: inline-block;
          width: 24px;
          height: 24px;
          background-image: url('../../../public/img/icon_whc_list.png');
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
    }
      .content-container{
        .table-container{
          border-radius: 8px;
          padding: 0 8px;
          padding-bottom: 20px;
          .table-item-container{
            width: 100%;
            border-radius: 8px;
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
  .page-container{
    text-align: right;
  }
  .row-bg{
    justify-content: flex-end;
    padding-bottom: 20px;
  }
  .el-pagination__jump{
    font-size: 14px;
    display: inline!important;
  }
  .click-item{
      cursor: pointer;
  }
  .click-item:hover{
      color: #0c66ff!important;
  }
}
</style>
