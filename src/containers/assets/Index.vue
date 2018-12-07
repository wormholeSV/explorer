<template lang="pug">
    div.asset-container
        div.asset-header
            div.asset-title
                img(src="../../../public/img/asset_explore.png")
                div {{ $t('nav.asset') }}
            div.input-container(ref="handlerInput")
                el-input(
                style="width: 293px"
                v-model="search"
                :placeholder="$t('asset.searchHolder')"
                size="md"
                suffix-icon="el-icon-search"
                @keyup.enter.native="onEnter"
                )
        el-table(
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        :header-cell-style="rowClass"
        )
            el-table-column(:label="$t('asset.id')" show-overflow-tooltip)
                template(slot-scope="scope")
                    div(@click="goToAsset(scope.row.propertyId)")
                        span.click-pointer {{scope.row.propertyId}}
            el-table-column(prop="propertyName" :label="$t('asset.name')")
            el-table-column(prop="propertyCategory" :label="$t('asset.category')" show-overflow-tooltip)
            el-table-column(prop="propertySubcategory" :label="$t('asset.subCategory')" show-overflow-tooltip)
            el-table-column(prop="propertyServiceUrl" :label="$t('asset.url')" show-overflow-tooltip)
                template(slot-scope="scope")
                    div(@click="goToHref(scope.row.propertyServiceUrl)").apostrophe
                        span.click-pointer {{scope.row.propertyServiceUrl}}
            el-table-column(:label="$t('asset.address')" show-overflow-tooltip)
                template(slot-scope="scope")
                    div(@click="goToAddress(scope.row.issuer)").apostrophe
                        span.click-pointer {{scope.row.issuer}}
            el-table-column(prop="txType" :label="$t('asset.type')")
        div(style="height: 32px")
        div.page-style
            div
                el-select(
                v-model="chosenType"
                size="small"
                @change="changeType"
                style="width: 180px"
                :disabled="isSearch"
                )
                    el-option(
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    )
            div
                el-pagination(
                background
                layout="prev, pager, next, jumper"
                :total="page.total"
                :page-size="page.pageSize"
                :current-page="page.currentPage"
                @current-change="changePage"
                )
</template>

<script>
import request from '../../util/request'
import popup from '../../util/notice'
import { translateAssetType, jumpToAddress, jumpToAsset } from '../../util/transform'

const { getProperties, dimQuery } = request

const getType = (value, typeOptions) => {
  let typeArr = typeOptions.filter((item) => {
    if (item.value === value) {
      return item.type
    }
  })
  return typeArr[0]
}

export default {
  data () {
    return {
      search: '',
      isSearch: false,
      tableData: [],
      typeOptions: [
        {
          value: 'Fixed Token',
          label: 'Fixed Token',
          type: 50
        },
        {
          value: 'Manageable Token',
          label: 'Manageable Token',
          type: 54
        },
        {
          value: 'Crowdsale Token',
          label: 'Crowdsale Token',
          type: 51
        },
        {
          value: 'All',
          label: 'All',
          type: -1
        }
      ],
      chosenType: 'All',
      loading: false,
      page: {
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
    goToHref (url) {
      let prefix = url.substr(0, 4)
      if (prefix !== 'http') {
        url = `http://${url}`
      }
      window.open(url, '_blank')
    },
    getPropertyList (params) {
      this.loading = true
      getProperties(params).then((data) => {
        this.loading = false
        if (data.code === 0) {
          let { result } = data
          let totalNum = result.total
          this.page.total = totalNum
          this.tableData = result.list.map((item) => {
            item.propertyCategory = item.propertyCategory || '-'
            item.propertySubcategory = item.propertySubcategory || '-'
            item.txType = translateAssetType(item.txType)
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
    getQueryList (params) {
      let keywords = this.search
      this.loading = true
      dimQuery(keywords, params).then((data) => {
        this.loading = false
        if (data.code === 0) {
          let { result } = data
          let totalNum = result.total
          this.page.total = totalNum
          if (!result || !result.list) {
            result.list = []
          }
          this.tableData = result.list.map((item) => {
            item.propertyCategory = item.propertyCategory || '-'
            item.propertySubcategory = item.propertySubcategory || '-'
            item.txType = translateAssetType(item.txType)
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
    getList (isSearch = false, pageNo = 1, pageSize = 15, propertyType = -1) {
      if (isSearch && this.search) {
        let params = { pageNo, pageSize }
        this.isSearch = isSearch
        this.chosenType = 'All'
        this.getQueryList(params)
      } else {
        let params = { pageNo, pageSize, propertyType }
        this.isSearch = false
        this.getPropertyList(params)
      }
    },
    changeType (val) {
      let propertyType = getType(val, this.typeOptions).type
      let pageSize = this.page.pageSize
      this.getList(false, 1, pageSize, propertyType)
      this.page.currentPage = 1
    },
    changePage (page) {
      this.page.currentPage = page
      if (this.isSearch) {
        this.getList(true, page, this.page.pageSize)
      } else {
        let propertyType = getType(this.chosenType, this.typeOptions).type
        this.getList(false, page, this.page.pageSize, propertyType)
      }
    },
    goToAsset (propertyId) {
      jumpToAsset(propertyId, this)
    },
    goToAddress (address) {
      jumpToAddress(address, this)
    },
    goSearch () {
      this.page.currentPage = 1
      this.getList(true)
    }
  },
  activated () {
    const clickNode = this.$refs['handlerInput'].childNodes[0].childNodes[3].childNodes[0].childNodes[0]
    clickNode.addEventListener('click', () => {
      this.goSearch()
    })
    this.getList()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss">
    .asset-container {
        max-width: 1216px;
        margin: 0 auto;
        .apostrophe {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .asset-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 40px;
            margin-bottom: 24px;
            .input-container {
                display: flex;
                flex-direction: row;
                flex: 1;
                justify-content: flex-end;
                .el-icon-search {
                    font-size: 20px;
                    cursor: pointer;
                }
                .el-input__inner {
                    border-radius: 36.5px!important;
                }
            }
            .asset-title {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                img {
                    width: 24px;
                    height: 24px;
                }
                div {
                    font-size: 24px;
                    font-weight: bold;
                    color: #0a1f44;
                    margin-left: 11px;
                }
            }
        }
        .page-style {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
    }
</style>
