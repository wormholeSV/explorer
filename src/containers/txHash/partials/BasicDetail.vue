<template lang="pug">
    div.container
        div.head.marginTwenty
            span.title {{$t('address.details')}}
        div.content
            div.head.marginTwenty
                span.subtitle {{$t('common.basic')}}
            div(style="height: 10px")
            el-row
                el-col(:span="7")
                    div.row-container.head
                        div.row-title {{$t('common.address') + ':'}}
                        div.row-content {{address}}
                el-col(:span="8" :offset="1")
                    div.row-container.head
                        div.row-title {{$t('address.whcBalance') + ':'}}
                        div.row-content {{addressData.balanceAvail}}
                el-col(:span="7" :offset="1")
                    div.row-container.head
                        div.row-title {{$t('block.transactionsAll') + ':'}}
                        div.row-content {{addressData.whcTxCount}}
            el-row
                el-col(:span="7")
                    div.row-container.head
                        div.row-title {{$t('address.whcExpense') + ':'}}
                        div.row-content {{addressData.consumedBal}}
                el-col(:span="8" :offset="1")
                    div.row-container.head
                        div.row-title {{$t('address.outputWhcCount') + ':'}}
                        div.row-content {{addressData.sendedBal}}
                el-col(:span="7" :offset="1")
                    div.row-container.head
                        div.row-title {{$t('address.inputWhcCount') + ':'}}
                        div.row-content {{addressData.receivedBal}}
</template>

<script>
export default {
  props: [ 'addressData', 'address' ],
  computed: {
  }
}
</script>

<style lang="scss" scoped>
    .container {
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
        .content {
            padding: 0 15px 0;
            .subtitle {
                font-size: 16px;
                font-weight: bold;
            }
            .row-container {
                font-size: 14px;
                .row-title {
                    font-weight: bold;
                }
                .row-content {
                    margin: 0 5px 0;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

</style>
