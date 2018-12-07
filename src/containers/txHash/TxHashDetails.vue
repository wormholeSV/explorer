<template lang="pug">
    div.txhash-body
        div.head
            div
                span(@click="goBack").click-pointer {{$t('common.back') + ' '}}
                span /
                span {{' ' + txhash}}
        div.container
            div.flex-row.top-title
                img(src="../../../public/img/icon_transaction_detail.png")
                div {{$t('tx.details')}}
            div.content.flex-row.md-height
                div.left-content
                    div.circle.flex-row {{ basicData.property_name && basicData.property_name.substr(0,1)}}
                    div.asset-name {{basicData.property_name}}
                    div.asset-type
                        el-tooltip(:content="basicData.type_str" placement="bottom")
                            span  {{basicData.type_str}}
                div.right-content.flex-column.crowd-right()
                    div.content-row.first-row.flex-row
                        div.item-box
                            div.item-head {{$t('asset.id')}}
                            div.item-content.click-pointer(@click='jumpToProperty(basicData.property_id)') {{basicData.property_id}}
                        div.item-box
                            div.item-head {{$t('common.amount')}}
                            div.item-content {{basicData.amount}}
                        div.item-box
                            div.item-head {{$t('common.state')}}
                            div.item-content {{basicData.state}}
                        div.item-box
                            div.item-head {{$t('common.fees')}}
                            div.item-content {{basicData.miner_fee}}

                    div.content-row.second-row.flex-row
                        div.item-box
                            div.item-head {{$t('block.height')}}
                            div.item-content.click-pointer(@click='jumpToBlockDetails(basicData.block_height)') {{basicData.block_height}}
                        div.item-box
                            div.item-head {{$t('common.time')}}
                            div.item-content {{basicData.block_time}}
                        div.item-box
                            div.item-head {{$t('tx.rawData')}}
                            el-tooltip(:content="basicData.raw_data" placement="bottom")
                                div.item-content {{basicData.raw_data}}
                        div.item-box(v-visible='basicData.fee_rate')
                            div.item-head {{$t('common.feeRate')}}
                            div.item-content {{basicData.fee_rate}} BCH
        div.content-container
              div.table-container
                  div(class='table-item-container')
                      div.item-title-container
                          div.item-container.hash
                              span(class='txhash') {{$t('asset.txHash')}} : {{basicData.tx_hash}}
                          div.item-container.type(v-if='false')
                              span {{$t('common.type')}}  :
                              span {{basicData.type_str}}
                          div.item-container.time(v-if='false')  {{basicData.block_time}}
                      div.item-content-container
                          div.item-content-container-inner
                              div.left-container(v-visible='basicData.sending_address')
                                  el-tooltip(:content="basicData.sending_address" placement="top")
                                    div(class='first-container click-item' @click='jumpToAddress(basicData.sending_address)') {{basicData.sending_address}}
                                  div.second-container
                                      div.amount(v-show='basicData.amount') {{basicData.amount}}
                                      div.property {{basicData.sending_property_name}}
                              div.center-container
                                  span.arrow-icon
                              div.right-container
                                  div.right-container-inner
                                      div(v-for='addressItem in basicData.reference_address' class='right-item-container')
                                          el-tooltip(:content="addressItem.address" placement="top")
                                                div(class='first-container click-item' @click='jumpToAddress(addressItem.address)') {{addressItem.address}}
                                          div.second-container
                                              div.amount(v-show='addressItem.amount||basicData.amount') {{addressItem.amount||basicData.amount}}
                                              div.property {{addressItem.property_name||basicData.property_name}}
                      div.item-footer-container
                          div(class='fee' v-show='basicData.whc_fee')
                              div.inner {{basicData.whc_fee}} WHC
                          div(class='confirmations' v-show='basicData.confirmations')
                              div.inner {{basicData.confirmations}} {{$t('block.confirmations')}}
</template>

<script>
import BasicDetail from './partials/BasicDetail'
import request from '../../util/request'
import popup from '../../util/notice'
import { format } from '../../util/transform'
const { getTxHashDetails } = request
export default {
  components: { BasicDetail },
  data () {
    return {
      basicData: {},
      txhash: ''
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getAddressInfo () {
      let { txhash } = this.$route.params
      this.txhash = txhash
      this.$loading()
      getTxHashDetails(txhash).then((data) => {
        this.$loading().close()
        if (data.code === 0) {
          let { result } = data
          let time
          this.basicData = result
          if (this.basicData.block_time) {
            time = format(this.basicData.block_time) || ''
          } else {
            time = '-'
          }
          this.basicData.block_time = time
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.$loading().close()
        popup.error(error, this)
      })
    },
    jumpToAddress (value) {
      let params = { address: value }
      this.$router.push({ name: 'addressDetails', params })
    },
    jumpToProperty (value) {
      let params = { propertyId: value }
      this.$router.push({ name: 'assetDetails', params })
    },
    jumpToBlockDetails (value) {
      let params = { paramsValue: value }
      this.$router.push({ name: 'blockDetails', params })
    }
  },
  activated () {
    let { txhash } = this.$route.params
    this.txhash = txhash
    this.getAddressInfo()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss">
.txhash-body{
    width: 1216px;
    margin: 0 auto;
    .fill-left {
        flex: 1;
    }
    .md-height {
        height: 251px;
        .left-content {
            padding-top: 33px;
        }
    }
    .lg-height {
        height: 354px;
        .left-content {
            padding-top: 84px;
        }
    }
    .container {
        padding-top: 43px;
        .top-title {
            max-width: 1216px;
            margin: 0 auto;
            margin-bottom: 34px;
            img {
                width: 24px;
                height: 24px;
            }
            div {
                line-height: 28px;
                font-size: 24px;
                font-weight: 500;
                color: #0a1f44;
                margin-left: 11px;
            }
        }
        .content {
            border-radius: 8px;
            max-width: 1228px;
            padding-left: 6px;
            padding-right: 6px;
            margin: 0 auto;
            box-shadow: 0 10px 11px 0 rgba(96, 131, 191, 0.05),
                        0 -4px 7px 0 rgba(96, 131, 191, 0.05);
            .crowd-right {
                .first-row {
                    margin-bottom: 40px!important;
                }
                .third-row {
                    margin-top: 40px;
                    .item-content {
                        text-align: left;
                    }
                }
            }
            .left-content {
                width: 212px;
                border-right: 4px solid #f1f2f4;
                .circle {
                    width: 65px;
                    height: 65px;
                    border-radius: 65px;
                    background-color: rgba(12, 102, 255, 0.1);
                    font-size: 28px;
                    font-weight: bold;
                    color: #0c66ff;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                }
                .asset-name {
                    margin-top: 20px;
                    margin-bottom: 12px;
                    font-size: 20px;
                    font-weight: 500;
                    line-height: 20px;
                    color: #53627c;
                }
                .asset-id {
                    font-size: 14px;
                    line-height: 14px;
                    color: #a6aebc;
                    font-weight: 500;
                    margin-bottom: 20px;
                }
                .asset-type {
                    margin: 0 auto;
                    width: 150px;
                    height: 35px;
                    line-height: 35px;
                    border-radius: 2px;
                    background-color: rgba(12, 102, 255, 0.05);
                    font-size: 16px;
                    font-weight: 500;
                    color: #53627c;
                    overflow: hidden;
                }
            }
            .right-content {
                padding-top: 36px;
                padding-left: 28px;
                flex: 1;
                .first-row {
                    margin-bottom: 44px;
                }
                .second-row {
                    .item-content {
                        text-align: left;
                    }
                }
                .content-row {}
            }

        }
        .flex-row {
            display: flex;
            flex-direction: row;
        }
        .flex-column {
            display: flex;
            flex-direction: column;
        }
        .item-box {
            width: 215px;
            margin-right: 28px;
            .item-head {
                font-size: 16px;
                font-weight: 500;
                text-align: left;
                margin-bottom: 16px;
                color: #8a94a6;
            }
            .item-content {
                font-size: 16px;
                color: #53627c;
                text-align: left;
                height: 35px;
                line-height: 35px;
                border-radius: 2px;
                background-color: rgba(138, 148, 166, 0.03);
                padding: 0 5px 0;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
    }
    .head {
        display: flex;
        flex-direction: row;
        align-items:flex-start ;
        justify-content: flex-start;
        margin-top: 20px;
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
    .item-body{
      width: 100%;
      box-shadow: 0 1px 1px 0 rgba(10, 31, 68, 0.08), 0 0 1px 0 rgba(10, 31, 68, 0.08);
      background-color: #ffffff;
      margin-top: 20px;
      font-size: 14px;
    }
    .item-content-container{
      width: 100%;
      display: flex;
              justify-content: center;
              margin-top: 60px;
              .item-content-container-inner{
                display: flex;
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
                  overflow: hidden;
                  color:#337ab7;;
                  .receive-address-inner{
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
                  .show-more{
                    text-align: center;
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
                  flex: 5;
                }
                &.type{
                  flex:2;
                  justify-content: center;
                }
                &.time{
                  flex:3;
                  justify-content: flex-end;
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
          }
        }
      }
  .click-item{
      cursor: pointer;
  }
  .click-item:hover{
      color: #0c66ff!important;
  }
}

</style>
