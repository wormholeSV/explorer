<template lang="pug">
    div.burn-body
        div.head
            div
                span(@click="goBack").click-pointer {{$t('common.back') + ' '}}
                span.router-line /
                span {{$t('burn.burnExplorer')}}
        div.basic-container
            div.title-body
                div.title-container
                    span.burn-details-icon
                    span.title-text   {{$t('burn.burnExplorer')}}
            div.content
                div.item-container
                    div.icon-container.avail
                    div.label {{$t('burn.availWhcCount')}}
                    div.text    {{burnData.Avail}}
                div.item-container
                    div.icon-container.total
                    div.label {{$t('block.transactionsAll')}}
                    div.text    {{burnData.Total}}
        div.list-container
            el-table(
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-class-name="rowClass"
        )
                el-table-column(width="180" prop="BlockTime" :label="$t('common.time')" show-overflow-tooltip)
                el-table-column(:label="$t('common.address')"  align="left" header-align='center' show-overflow-tooltip)
                    template(slot-scope="scope"  )
                        div(@click="jumpToDetails(scope.row.Address)")
                            span.click-pointer {{scope.row.Address}}
                el-table-column(width="160" prop="Bch" :label="$t('home.burningAmount')" show-overflow-tooltip)
                el-table-column(width="160" prop="Whc" :label="$t('home.burningWhcAmount')" show-overflow-tooltip)
                el-table-column(prop="Process" :label="$t('burn.process')"  align="center" width="130")
                el-table-column(prop="MatureTime" :label="$t('burn.estimatedTime')" width='180' align="center")
        div(style="height: 20px")
        el-row(type="flex" class="page-container")
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
import { format } from '../../util/transform'
const { getBurnInfo, getBurnList } = request
export default {
  data () {
    return {
      burnData: {},
      tableData: [],
      loading: false,
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 15
      }
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getList (pageNo = 1, pageSize = 15) {
      let params = { pageNo, pageSize }
      this.loading = true
      getBurnList(params).then((data) => {
        this.loading = false
        if (data.code === 0) {
          let { result } = data
          let totalNum = result.total
          this.page.total = totalNum
          let resultList = [ ...result.list ]
          for (let i = 0; i < resultList.length; i++) {
            resultList[i].BlockTime = format(resultList[i].BlockTime)
            resultList[i].MatureTime = format(resultList[i].MatureTime)
          }
          this.tableData = resultList
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.loading = false
        popup.error(error, this)
      })
    },
    getAddressInfo () {
      this.$loading()
      getBurnInfo().then((data) => {
        this.$loading().close()
        if (data.code === 0) {
          let { result } = data
          this.burnData = result
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.$loading().close()
        popup.error(error, this)
      })
    },
    changePage (page) {
      this.page.currentPage = page
      this.getList(page, this.page.pageSize)
    },
    jumpToDetails (value) {
      let params = { address: value }
      this.$router.push({ name: 'addressDetails', params })
    },
    rowClass () {
      return 'rowClass'
    }
  },
  activated () {
    this.getAddressInfo()
    this.getList()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss">
.burn-body{
  max-width: 1216px;
  margin: 0 auto;
    .head {
        display: flex;
        flex-direction: row;
        align-items:flex-start ;
        justify-content: flex-start;
        padding-top: 20px;
    }
    .router-line{
        margin: 0 5px;
    }
    .click-pointer {
        color:blue;
        cursor: pointer;
    }
    .line {
        background-color: lightgrey;
        height: 1px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .basic-container{
        .marginTwenty {
            margin-top: 20px;
        }
        .head {
            display: flex;
            flex-direction: row;
            align-items:flex-start ;
            justify-content: flex-start;
            .title {
                font-size: 18px;
                font-weight: bold;
            }
        }
        .title-body{
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        .title-container{
            display: flex;
            align-items: center;
            .burn-details-icon{
            display: inline-block;
            width: 24px;
            height: 24px;
            background-image: url('../../../public/img/burn.png');
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
        .content {
            display: flex;
            margin-top: 40px;
            .item-container{
                flex: 1;
                padding: 32px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                border-radius: 8px;
                box-shadow: 0 8px 10px 0 rgba(10, 31, 68, 0.1), 0 0 1px 0 rgba(10, 31, 68, 0.08);
                background-color: #ffffff;
                background-image: url('../../../public/img/icon_whc.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: right bottom;
                .icon-container{
                width: 83px;
                height: 83px;
                background-size: contain;
                background-repeat: no-repeat;
                &.avail{
                background-image: url('../../../public/img/icon_use_whc.png');
                }
                &.total{
                background-image: url('../../../public/img/icon_all_whc.png');
                }
                }
                .label{
                font-size: 18px;
                color: #0a1f44;
                margin-top: 24px;
                }
                .text{
                font-size: 24px;
                color: #0c66ff;
                font-weight: 500;
                margin-top: 20px;
                }
                &:first-child{
                    margin-right: 30px;
                }
            }
        }
    }
    .list-container{
        margin-top: 40px;
    }
    .rowClass{
    color: #0a1f44;
    font-size: 18px;
    }
    .page-container{
    justify-content: flex-end;
    margin-bottom: 60px;
    }
}

</style>
