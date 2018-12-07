<template lang="pug">
    div.container
        div.flex-row.top-title
            img(src="../../../../public/img/asset_title.png")
            div {{$t('common.propertyDetails')}}
        div.content.flex-row(:class="isCrowdSale ? 'lg-height' : 'md-height'")
            div.left-content
                div.circle.flex-row {{ propertyData.name && propertyData.name.substr(0,1)}}
                div.asset-name {{propertyData.name}}
                div.asset-id {{$t('asset.id') + ':' + propertyData.propertyid}}
                div.asset-type {{propertyData.txType}}
            div.right-content.flex-column.crowd-right(v-if="isCrowdSale")
                div.content-row.first-row.flex-row
                    div.item-box
                        div.item-head {{$t('asset.category')}}
                        el-tooltip(:content="propertyData.category" placement="bottom")
                            div.item-content {{propertyData.category}}
                    div.item-box
                        div.item-head {{$t('asset.subCategory')}}
                        el-tooltip(:content="propertyData.subcategory" placement="bottom")
                            div.item-content {{propertyData.subcategory}}
                    div.item-box
                        div.item-head {{$t('common.amount')}}
                        el-tooltip(:content="propertyData.totaltokens" placement="bottom")
                            div.item-content {{propertyData.totaltokens}}
                    div.item-box
                        div.item-head {{$t('asset.alreadyBought')}}
                        el-tooltip(:content="propertyData.purchasedtokens" placement="bottom")
                            div.item-content {{propertyData.purchasedtokens}}
                div.content-row.second-row.flex-row
                    div.item-box
                        div.item-head {{$t('asset.start')}}
                        el-tooltip(:content="propertyData.starttime" placement="bottom")
                            div.item-content.time-style {{propertyData.starttime}}
                    div.item-box
                        div.item-head {{$t('asset.end')}}
                        el-tooltip(:content="propertyData.deadline" placement="bottom")
                            div.item-content.time-style {{propertyData.deadline}}
                    div.item-box
                        div.item-head {{$t('asset.isActive')}}
                        el-tooltip(:content="propertyData.active" placement="bottom")
                            div.item-content {{propertyData.active}}
                    div.item-box
                        div.item-head {{$t('common.precision')}}
                        el-tooltip(:content="propertyData.precision" placement="bottom")
                            div.item-content {{propertyData.precision}}
                div.content-row.thrid-row.flex-row
                    div.item-box
                        div.item-head {{$t('asset.url')}}
                        el-tooltip(:content="propertyData.url" placement="bottom")
                            div.item-content.click-pointer(@click="goToHref(propertyData.url)") {{propertyData.url}}
                    div.item-box
                        div.item-head {{$t('common.issuer')}}
                        el-tooltip(:content="propertyData.issuer" placement="bottom")
                            div.item-content.click-pointer(@click="goAddress(propertyData.issuer)") {{propertyData.issuer}}
                    div.item-box
                        div.item-head {{$t('asset.Ratio')}}
                        el-tooltip(:content="propertyData.tokensperunit" placement="bottom")
                            div.item-content {{propertyData.tokensperunit}}
                    div.item-box
                        div.item-head {{$t('asset.earlyBonus')}}
                        el-tooltip(:content="propertyData.earlybonus" placement="bottom")
                            div.item-content {{propertyData.earlybonus}}
            div.right-content.flex-column(v-else)
                div.content-row.first-row.flex-row
                    div.item-box
                        div.item-head {{$t('asset.category')}}
                        el-tooltip(:content="propertyData.category" placement="bottom")
                            div.item-content {{propertyData.category}}
                    div.item-box
                        div.item-head {{$t('asset.subCategory')}}
                        el-tooltip(:content="propertyData.subcategory" placement="bottom")
                            div.item-content {{propertyData.subcategory}}
                    div.item-box
                        div.item-head {{$t('common.amount')}}
                        el-tooltip(:content="propertyData.totaltokens" placement="bottom")
                            div.item-content {{propertyData.totaltokens}}
                    div.item-box
                        div.item-head {{$t('common.precision')}}
                        el-tooltip(:content="propertyData.precision" placement="bottom")
                            div.item-content {{propertyData.precision}}
                div.content-row.second-row.flex-row
                    div.item-box
                        div.item-head {{$t('asset.url')}}
                        el-tooltip(:content="propertyData.url" placement="bottom")
                            div.item-content.click-pointer(@click="goToHref(propertyData.url)") {{propertyData.url}}
                    div.item-box.fill-left
                        div.item-head {{$t('common.issuer')}}
                        el-tooltip(:content="propertyData.issuer" placement="bottom")
                            div.item-content.click-pointer(@click="goAddress(propertyData.issuer)") {{propertyData.issuer}}
                    div.item-box
                    div.item-box
</template>

<script>
import { jumpToAddress } from '../../../util/transform'

export default {
  props: [ 'propertyData' ],
  computed: {
    isCrowdSale: vm => {
      if (vm.propertyData && vm.propertyData.txType && vm.propertyData.txType === 'Crowdsale Token') {
        return true
      }
      return false
    }
  },
  methods: {
    goToHref (url) {
      let prefix = url.substr(0, 4)
      if (prefix !== 'http') {
        url = `http://${url}`
      }
      window.open(url, '_blank')
    },
    goAddress (address) {
      jumpToAddress(address, this)
    }
  }
}
</script>

<style lang="scss" scoped>
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
                .thrid-row {
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
                color: #8a94a6;
                text-align: left;
                margin-bottom: 16px;
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
            .time-style {
                background-color: rgba(240, 61, 61, 0.03);
                color: #f03d3d;
            }
        }
    }
</style>
