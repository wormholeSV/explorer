<template lang="pug">
    div.block-list-container
        div.title-body
            div.title-container
                span.explorer-icon
                span.title-text   {{$t('block.blockExplorer')}}
            div.time-container
                el-date-picker(v-model="dateValue" type="datetimerange" :range-separator="$t('common.to')" :start-placeholder="$t('common.startTime')" :end-placeholder="$t('common.endTime')"  value-format="timestamp" @change="getListByTime")
        div(style="height: 20px")
        el-table(
        v-loading="loading"
        :data="tableData"
        stripe
        class='table-container'
        :header-cell-class-name="rowClass"
        )
            el-table-column(prop="block_height" :label="$t('block.height')" align="center" show-overflow-tooltip)
                template(slot-scope="scope")
                    div(@click="jumpToDetails(scope.row.block_height)")
                        span.click-pointer {{scope.row.block_height}}
            el-table-column(prop="size" :label="$t('block.size')"  align="center")
            el-table-column(prop="block_time" :label="$t('block.comeOutTime')"  align="center")
            el-table-column(prop="whccount" :label="$t('block.transactions')"  align="center")
                template(slot-scope="scope")
                    div(@click="jumpToDetails(scope.row.block_height)")
                        span.click-pointer {{scope.row.whccount}}
            el-table-column(:label="$t('block.blockHash')" width='600' header-align='center')
                template(slot-scope="scope")
                    div(@click="jumpToDetails(scope.row.block_hash)")
                        el-tooltip(:content="scope.row.block_hash" placement="top")
                            span.click-pointer {{scope.row.block_hash}}
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
const { getBlockList } = request

export default {
  data () {
    return {
      tableData: [],
      loading: false,
      page: {
        currentPage: 1,
        total: 0,
        pageSize: 15
      },
      dateValue: '',
      startTime: 0,
      endTime: 0
    }
  },
  methods: {
    getList (pageNo = 1, pageSize = 15, startTime = 0, endTime = 0) {
      let params = { pageNo, pageSize }
      if (startTime && startTime > 0) {
        params.from = startTime
      }
      if (endTime && endTime > 0) {
        params.to = endTime
      }
      this.loading = true
      getBlockList(params).then((data) => {
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
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.loading = false
        popup.error(error, this)
      })
    },
    getListByTime (value) {
      let self = this
      if (value) {
        self.startTime = Math.floor(value[0] / 1000)
        self.endTime = Math.floor(value[1] / 1000)
      }
      self.getList(1, self.page.pageSize, self.startTime, self.endTime)
      self.page.currentPage = 1
    },
    changePage (page) {
      this.page.currentPage = page
      this.getList(page, this.page.pageSize, this.startTime, this.endTime)
    },
    jumpToDetails (value) {
      let params = { paramsValue: value }
      this.$router.push({ name: 'blockDetails', params })
    },
    rowClass () {
      return 'rowClass'
    }
  },
  activated () {
    this.getList()
  },
  deactivated () {
    this.startTime = 0
    this.endTime = 0
    this.dateValue = ''
    this.$destroy()
  }
}
</script>

<style lang="scss">
.block-list-container{
  max-width: 1216px;
  margin: 0 auto;
  .title-body{
    display: flex;
    justify-content: space-between;
    margin-top: 53px;
    .title-container{
      display: flex;
      align-items: center;
      .explorer-icon{
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('../../../public/img/icon-block-explore@3x.png');
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
  .click-pointer {
    color: #0c66ff;
    cursor: pointer;
  }
  .rowClass{
    color: #0a1f44;
    font-size: 18px;
  }
  .table-container{
    width: 100%;
    margin-top:20px;
  }
  .page-container{
    justify-content: flex-end;
    margin-bottom: 60px;
  }
}
</style>
