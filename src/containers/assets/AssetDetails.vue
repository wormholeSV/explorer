<template lang="pug">
    div
        div.head
            div(@click="goBack").go-back
                span {{$t('common.back') + ' '}}
                span /
                span.asset-title {{' ' + $t('asset.oneAsset') + '-' + this.propertyData.name}}
        property-detail(:propertyData="propertyData")
        property-tabs
</template>

<script>
import PropertyDetail from './partials/PropertyDetail'
import PropertyTabs from './partials/PropertyTabs'
import request from '../../util/request'
import popup from '../../util/notice'
import { translateAssetType, format } from '../../util/transform'

const { getAProperty } = request
export default {
  components: { PropertyDetail, PropertyTabs },
  data () {
    return {
      propertyData: {}
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    getPropertyInfo () {
      let { propertyId } = this.$route.params
      this.$loading()
      getAProperty(propertyId).then((data) => {
        this.$loading().close()
        if (data.code === 0) {
          let { result } = data
          let { txType, category, subcategory } = result.data
          result.data.txType = translateAssetType(txType)
          result.data.category = category || '-'
          result.data.subcategory = subcategory || '-'
          if (result.data.txType === 'Crowdsale Token') {
            if (result.data.active) {
              result.data.active = 'Yes'
            } else {
              result.data.active = 'No'
            }
            result.data.starttime = format(result.data.starttime)
            result.data.deadline = format(result.data.deadline)
          }
          Object.keys(result.data).forEach((key) => {
            result.data[key] = result.data[key] + ''
          })
          this.propertyData = { ...result.data }
        } else {
          popup.error(data.message, this)
        }
      }).catch((error) => {
        this.$loading().close()
        popup.error(error, this)
      })
    }
  },
  activated () {
    this.getPropertyInfo()
  },
  deactivated () {
    this.$destroy()
  }
}
</script>

<style lang="scss" scoped>
    .head {
        max-width: 1216px;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        align-items:flex-start ;
        justify-content: flex-start;
        margin-top: 40px;
    }
    .go-back {
        cursor: pointer;
        font-size: 20px;
        color: #0c66ff;
    }
    .asset-title {
        font-weight: 500;
        color: #8a94a6;
    }
</style>
