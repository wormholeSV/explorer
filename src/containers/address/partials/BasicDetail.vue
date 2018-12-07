<template lang="pug">
    div.container
        div.title-body
                div.title-container
                    span.block-details-icon
                    span.title-text   {{$t('address.details')}}
        div.content-container
            div(class='content-container-inner')
                el-row
                    el-col(:span="11")
                        div.row-container.head
                            div.row-title {{$t('common.address') }}
                            div.row-content
                                div {{address}}
                                div(class='copy-icon' @click='copyClick(address)')
                                div.qr-container
                                    span(class='qr-icon' slot="reference" @mouseover="qrActive = true" @mouseleave="qrActive = false")
                                    img(:src="('https://chart.googleapis.com/chart?chs=200x200&cht=qr&=UTF-8&chl='+address)" class='qr-img' v-show="qrActive")
                    el-col(:span="5" :offset="1")
                        div.row-container.head
                            div.row-title {{$t('address.whcBalance')}}
                            div.row-content {{addressData.balanceAvail}}
                    el-col(:span="5" :offset="1")
                        div.row-container.head
                            div.row-title {{$t('block.transactionsAll')}}
                            div.row-content {{addressData.whcTxCount}}
                el-row.second-container
                    el-col(:span="11")
                        div.row-container.head
                            div.row-title {{$t('address.whcExpense')}}
                            div.row-content {{addressData.consumedBal}}
                    el-col(:span="5" :offset="1")
                        div.row-container.head
                            div.row-title {{$t('address.outputWhcCount')}}
                            div.row-content {{addressData.sendedBal}}
                    el-col(:span="5" :offset="1")
                        div.row-container.head
                            div.row-title {{$t('address.inputWhcCount')}}
                            div.row-content {{addressData.receivedBal}}
</template>

<script>
export default {
  props: [ 'addressData', 'address' ],
  data () {
    return {
      qrActive: false
    }
  },
  computed: {
  },
  methods: {
    copyClick (value) {
      let self = this
      self.$copyText(value).then(function (e) {
        self.$message({
          message: 'copy success',
          type: 'success'
        })
      }, function (e) {
      })
    },
    showQr (value) {

    },
    getQr (value) {
      return `<img src='https://chart.googleapis.com/chart?chs=200x200&cht=qr&=UTF-8&chl=${value}'>`
    }
  }
}
</script>

<style lang="scss" scoped>
    .container {
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
          background-image: url('../../../../public/img/icon_address.png');
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
        .content-container {
            padding: 10px;
            .content-container-inner{
            margin-top: 20px;
            padding: 26px 40px;
            border-radius: 8px;
            box-shadow: 0 10px 11px 0 rgba(96, 131, 191, 0.1), 0 -4px 7px 0 rgba(96, 131, 191, 0.08);
            background-color: #ffffff;
            }
            .subtitle {
                font-size: 16px;
                font-weight: bold;
            }
            .row-container {
                display: flex;
                flex-direction: column;
                font-size: 16px;
                text-align: left;
                .row-title {
                    color: #a6aebc;
                    line-height: 35px;
                    height: 35px;

                }
                .row-content {
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    color: #53627c;
                    font-weight: 700;
                    display: flex;
                    margin-top: 10px;
                }
                .copy-icon{
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        background-image: url('../../../../public/img/copy_icon.png');
                        background-size: contain;
                        background-repeat: no-repeat;
                        flex-basis: auto;
                        margin-left: 5px;
                }
                .qr-container{
                    position: relative;
                    display: inline-block;
                    flex-basis: auto;
                }
                .qr-icon{
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        background-image: url('../../../../public/img/qr_icon.png');
                        background-size: contain;
                        background-repeat: no-repeat;
                        margin-left: 5px;
                }
                .qr-img{
                    position: absolute;
                    z-index: 100;
                    left: -80px;
                    top: 50px;
                }
            }
        }
        .second-container{
            margin-top: 20px;
        }
    }

</style>
