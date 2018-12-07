<template lang="pug">
    div.home-container
        el-row
            el-col(:span="24")
                div(style="height:42px")
                div.section-title-box
                    img.section-img(src="../../../public/img/block.png")
                    div.section-content {{$t('home.blockInfo')}}
                div(style="height: 29px")
        div.info-container
            div.table-info
                div.table-left
                    div(style="height:51px")
                    div.sub-title(style="height:36px")
                        img(src="../../../public/img/survey.png" style="height: 18px; width: 18px")
                        div(style="margin-left: 8px;") {{$t('home.survey')}}
                    div(style="height: 11px")
                    div.survey-box
                        span {{$t('home.surveyTitle')}}
                        span {{$t('home.surveyDes')}}
                    div(style="height: 41px")
                    div.sub-title
                        img(src="../../../public/img/time.png")
                        div {{$t('home.blockTime')}}
                    div(style="height: 17px")
                    div {{surveyData.block_time}}
                    div(style="height: 40px")
                    div.sub-title
                        img(src="../../../public/img/height.png")
                        div {{$t('home.height')}}
                    div(style="height: 15px")
                    div(@click="goToBlock(surveyData.block_height)").go-block {{surveyData.block_height}}
                div.table-right
                    div.transaction-title
                        img(src="../../../public/img/number.png")
                        div {{$t('home.WHCTransactions')}}
                    div.right-box.flex-style-row
                        div.circle Now
                        div.right-content.flex-style-column
                            div.mid-content {{$t('home.latestAmount')}}
                            div.right-num {{surveyData.current_whc_count}}
                    div(style="height: 15px")
                    div.right-box.flex-style-row
                        div.circle 24
                        div.right-content.flex-style-column
                            div.mid-content {{$t('home.dayAmount')}}
                            div.right-num {{surveyData.one_day_whc_count}}
                    div(style="height: 15px")
                    div.right-box.flex-style-row
                        div.circle All
                        div.right-content.flex-style-column
                            div.mid-content {{$t('home.allMount')}}
                            div.right-num {{surveyData.total_whc_count}}
            div.line-info
                canvas(ref="weekSource" width="592" height="382")
        div(style="height: 62px")
        div.section-title-box
            img.section-img(src="../../../public/img/new.png")
            div.section-content {{$t('home.latestBlock')}}
            div.jump-more-box
                div(v-if="showRecentMore")
                    div.more-container(@click="getMoreBlock")
                        div {{$t('common.more')}}
                            i(class='more-icon').el-icon-d-arrow-right
        div(style="height:25px")
        el-table(
        :data="recentBlockData"
        stripe
        style="width: 100%"
        :header-cell-style="rowClass"
        )
            el-table-column(width="160" :label="$t('block.height')" show-overflow-tooltip)
                template(slot-scope="scope")
                    div(@click="goToBlock(scope.row.block_height)")
                        span.click-pointer {{scope.row.block_height}}
            el-table-column(width="160" prop="size" :label="$t('home.recentBlock.blockSize')" show-overflow-tooltip)
            el-table-column(width="160" prop="block_time" :label="$t('asset.blockTime')" show-overflow-tooltip)
            el-table-column(width="180" :label="$t('block.transactions')" show-overflow-tooltip)
                template(slot-scope="scope")
                    div(@click="goToBlock(scope.row.block_height)")
                        span.click-pointer {{scope.row.whccount}}
            el-table-column(:label="$t('home.recentBlock.blockHash')" show-overflow-tooltip)
                template(slot-scope="scope")
                    div(@click="goToBlock(scope.row.block_hash)")
                        span.click-pointer {{scope.row.block_hash}}
        div(style="height:62px")
        div.section-title-box
            img.section-img(style="width: 24px; height: 28px")(src="../../../public/img/burn.png")
            div.section-content(style="line-height: 28px") {{$t('home.burningDetails')}}
            div.jump-more-box(style="line-height: 28px")
                div(v-if="showBurnMore")
                    div.more-container(@click="getMoreBurnData")
                        div {{$t('common.more')}}
                            i(class='more-icon').el-icon-d-arrow-right
        div(style="height:25px")
        el-table(
        :data="burnData"
        stripe
        style="width: 100%"
        :header-cell-style="rowClass"
        )
            el-table-column(width="180" prop="BlockTime" :label="$t('asset.blockTime')" show-overflow-tooltip)
            el-table-column(:label="$t('home.address')" show-overflow-tooltip)
                template(slot-scope="scope")
                    div(@click="goToAddress(scope.row.Address)").apostrophe
                        span.click-pointer {{scope.row.Address}}
            el-table-column(width="160" prop="Bch" :label="$t('home.burningAmount')" show-overflow-tooltip)
            el-table-column(width="160" prop="Whc" :label="$t('home.burningWhcAmount')" show-overflow-tooltip)
            el-table-column(width="130" prop="Process" :label="$t('home.progress')" show-overflow-tooltip)
            el-table-column(width="180" prop="MatureTime" :label="$t('home.matureTime')" show-overflow-tooltip)

</template>

<script>
import request from '../../util/request'
import { format, jumpToBlock, jumpToAddress } from '../../util/transform'
import Chart from 'chart.js'
import popup from '../../util/notice'
const { getSurveyInfo, getWhcSummary, getBlockList, getBurningWHC, getWeekWormhole } = request
export default {
  data () {
    return {
      surveyData: {},
      recentBlockData: [],
      burnData: [],
      burnPage: {
        currentPage: 1
      },
      recentPage: {
        currentPage: 1
      },
      showRecentMore: false,
      showBurnMore: false,
      summaryData: {
        avail: '',
        total: ''
      }
    }
  },
  methods: {
    rowClass () {
      return {
        color: '#0a1f44'
      }
    },
    getSurvey (itemData) {
      let { result } = itemData
      result.block_time = format(result.block_time)
      this.surveyData = { ...result }
    },
    getWhc (itemData) {
      let result = itemData.result
      this.summaryData.avail = result.Avail
      this.summaryData.total = result.Total
    },
    showChart (itemData) {
      let ctx = this.$refs.weekSource
      let { avail, total } = this.summaryData
      let result = itemData.result
      let xLabels = Object.keys(result)
      let yData = Object.values(result)
      // eslint-disable-next-line
      let myChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              data: [ ...yData ],
              pointBackgroundColor: '#fff',
              backgroundColor: [
                'rgba(12,102,255, 0.1)'
              ],
              borderColor: [
                '#0C66FF'
              ],
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          tooltips: {
            enabled: true,
            backgroundColor: 'rgba(12,102,255)',
            yPadding: 14,
            xPadding: 14,
            displayColors: false,
            callbacks: {
              label (tooltipItem) {
                return `WHC Transactions: ${tooltipItem.yLabel}`
              },
              title (tooltipItem) {
                return `Date: ${tooltipItem[0].xLabel}`
              }
            }
          },
          legend: {
            display: false
          },
          title: {
            display: true,
            text: `WHC Amount(avail/total) :${avail} / ${total}`,
            position: 'top',
            padding: 15
          },
          scales: {
            xAxes: [
              {
                labels: [ ...xLabels ],
                gridLines: {
                  display: false
                }
              }
            ]
          }
        }
      })
    },
    getRecentBlock (pageNo = 1, pageSize = 10) {
      let params = { pageNo, pageSize }
      getBlockList(params).then((data) => {
        if (data.code === 0) {
          this.getRecentBlockList(data)
        } else {
          popup.error(data.message, this)
        }
      })
    },
    getRecentBlockList (itemData, pageSize = 10) {
      let { result } = itemData
      let totalNum = result.total
      let maxLength = this.recentBlockData.length + pageSize
      this.recentPage.currentPage = result.pageNo
      if (maxLength < totalNum) {
        this.showRecentMore = true
      } else {
        this.showRecentMore = false
      }
      result.list.forEach((item) => {
        item.block_time = format(item.block_time)
        this.recentBlockData.push(item)
      })
    },
    getMoreBlock () {
      this.$router.push({ name: 'block' })
    },
    getBurnData (pageNo = 1, pageSize = 10) {
      let params = { pageNo, pageSize }
      getBurningWHC(params).then((data) => {
        if (data.code === 0) {
          this.getBurnDataList(data)
        }
      })
    },
    getBurnDataList (itemData, pageSize = 10) {
      let { result } = itemData
      let totalNum = result.total
      let maxLength = this.burnData.length + pageSize
      this.burnPage.currentPage = result.pageNo
      if (maxLength < totalNum) {
        this.showBurnMore = true
      } else {
        this.showBurnMore = false
      }
      result.list.forEach((item) => {
        item.BlockTime = format(item.BlockTime)
        item.MatureTime = format(item.MatureTime)
        this.burnData.push(item)
      })
    },
    getMoreBurnData () {
      this.$router.push({ name: 'BurnListPage' })
    },
    initializeSource () {
      let { getSurvey, getWhc, showChart, getRecentBlockList, getBurnDataList } = this
      let asyncArray = [getSurveyInfo, getWhcSummary, getBlockList, getBurningWHC, getWeekWormhole]
      this.$loading()
      Promise.all(asyncArray.map(item => item())).then((list) => {
        this.$loading().close()
        list.forEach((itemData, index) => {
          if (itemData.code === 0) {
            index === 0 && getSurvey(itemData)
            index === 1 && getWhc(itemData)
            index === 2 && getRecentBlockList(itemData)
            index === 3 && getBurnDataList(itemData)
            index === 4 && showChart(itemData)
          } else {
            popup.error(itemData.message, this)
          }
        })
      }).catch((error) => {
        this.$loading().close()
        popup.error(error, this)
      })
    },
    goToBlock (height) {
      jumpToBlock(height, this)
    },
    goToAddress (address) {
      jumpToAddress(address, this)
    }
  },
  activated () {
    this.initializeSource()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .home-container {
        max-width: 1216px;
        margin: 0 auto;
        padding-bottom: 90px;
    }
    .row-bg {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .more-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        cursor: pointer;
    }
    .apostrophe {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: blue;
    }
    .section-title-box {
        display: flex;
        .section-img {
            width: 24px;
            height: 24px;
        }
        .section-content {
            margin-left: 13px;
            font-size: 24px;
            line-height: 28px;
            color: #0a1f44;
            font-weight: bold;
        }
        .jump-more-box {
            flex: 1;
            font-size: 18px;
            color: #0c66ff;
        }
        .more-icon{
            display: inline-block;
            vertical-align: middle;
            margin-bottom: 4px;
            margin-left: 2px;
        }
    }
    .info-container {
        display: flex;
        .table-info {
            width: 592px;
            height: 382px;
            border-radius: 4px;
            box-shadow: 0 10px 11px 0 rgba(96, 131, 191, 0.04), 0 -4px 7px 0 rgba(96, 131, 191, 0.04);
            background:url("../../../public/img/rectangle.png");
            background-size: 100% 100%;
            background-attachment: fixed;
            display: flex;
            .table-img {
                margin-top: 28px;
                margin-bottom: 18px;
                img {
                    width: 70px;
                    height: 70px;
                    opacity: 0.16;
                }
            }
            .table-left {
                width: 245px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-left: 36px;
                color: #fff;
                font-size: 18px;
                .sub-title {
                    display: flex;
                    align-items: center;
                    img {
                        width: 16px;
                        height: 16px;
                        opacity: 0.5;
                    }
                    div {
                        height: 16px;
                        opacity: 0.5;
                        color: #ffffff;
                        line-height: 16px;
                        margin-left: 10px;
                        font-size: 18px;
                    }
                }
                .survey-box {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    span {
                        line-height: 17px;
                    }
                }
            }
            .table-right {
                flex: 1;
                .transaction-title {
                    display: flex;
                    margin-top: 61px;
                    margin-bottom: 16px;
                    img {
                        width: 21px;
                        height: 21px;
                        color: white;
                        opacity: .5;
                    }
                    div {
                        margin-left: 10px;
                        font-size: 20px;
                        height: 20px;
                        line-height: 20px;
                        opacity: 0.5;
                        color: #fff
                    }
                }
                .right-box {
                    width: 275px;
                    height: 70px;
                    border-radius: 4px;
                    background-color: #ffffff;
                    .circle {
                        width: 45px;
                        height: 45px;
                        line-height: 45px;
                        border-radius: 45px;
                        background-color: rgba(12, 102, 255, 0.1);
                        font-size: 14px;
                        color: #0c66ff;
                        font-weight: 500;
                        margin-left: 16px;
                    }
                    .right-content {
                        margin-left: 17px;
                        font-weight: 500;
                        align-items: flex-start;
                        .mid-content {
                            font-size: 16px;
                            height: 16px;
                            line-height: 16px;
                        }
                        .right-num {
                            font-size: 18px;
                            color: #0c66ff;
                            line-height: 18px;
                            margin-top: 9px;
                        }
                    }
                }
            }
        }
        .line-info {
            width: 592px;
            height: 382px;
            border-radius: 4px;
            box-shadow: 0 10px 11px 0 rgba(96, 131, 191, 0.04), 0 -4px 7px 0 rgba(96, 131, 191, 0.04);
            margin-left: 32px;
        }
        .flex-style-row {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .flex-style-column {
            display: flex;
            flex-direction: column;
        }
        .go-block {
            cursor: pointer;
        }
    }
</style>
