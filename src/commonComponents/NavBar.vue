<template lang="pug">
    div.nav-container
        div.nav-box
            el-row(type="flex" class="row-bg")
                div.img-container
                    img(src="../../public/img/wormhole_logo@3x.png").wm-logo
                div(style="flex: 1")
                div
                    el-menu(
                    :default-active="activeRoute"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    )
                        el-menu-item(index="home") {{$t('nav.home')}}
                        el-menu-item(index="block") {{$t('nav.block')}}
                        el-menu-item(index="assets") {{$t('nav.asset')}}
                        el-menu-item.hide-style(index="hide")
                div
                    div.drop-style(@click="goToWallet") {{$t('nav.wallet')}}
                div
                    el-dropdown.drop-style(@command="handleCommand")
                        span.el-dropdown-link {{lanDes}}
                            i.el-icon-arrow-down.el-icon--right
                        el-dropdown-menu(slot="dropdown")
                            el-dropdown-item(command="en")
                                span(style="font-size: 14px; font-weight: 100" ) {{$t('nav.enLan')}}
                            el-dropdown-item(command="zh")
                                span(style="font-size: 14px; font-weight: 100" ) {{$t('nav.zhLan')}}
                div
                    el-dropdown.drop-style(@command="changeNet")
                        span.el-dropdown-link {{netDes}}
                            i.el-icon-arrow-down.el-icon--right
                        el-dropdown-menu(slot="dropdown")
                            el-dropdown-item(command="mainNet")
                                span(style="font-size: 14px; font-weight: 100" ) Mainnet
                            el-dropdown-item(command="testNet")
                                span(style="font-size: 14px; font-weight: 100" ) Testnet
                div.input-container(ref="handlerInput")
                    el-input(
                    style="width: 293px"
                    v-model="search"
                    :placeholder="$t('nav.search')"
                    size="md"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="onEnter"
                    )
</template>

<script>
import isBCHCashAddress from '../util/judgeBchAddress'
import popup from '../util/notice'
import { jumpToBlock, jumpToAddress, jumpToTxHash } from '../util/transform'
import { mapState, mapMutations } from 'vuex'

const baseUrls = {
  mainNet: '/mainnetapi',
  testNet: '/testnetapi'
}
export default {
  data () {
    return {
      search: '',
      netDes: 'Main Net'
    }
  },
  methods: {
    ...mapMutations(['changeActiveRoute']),
    onEnter () {
      this.goPages()
    },
    getNet () {
      let baseUrl = localStorage.getItem('baseUrl') || '/mainnetapi'
      let netDes = ''
      if (baseUrl === '/mainnetapi') {
        netDes = 'Mainnet'
      } else {
        netDes = 'Testnet'
      }
      this.netDes = netDes
    },
    goToWallet () {
      window.open('https://wallet.wormhole.cash/#/', '_blank')
    },
    handleCommand (command) {
      this.$i18n.locale = command
      localStorage.setItem('lan', command)
    },
    changeNet (net) {
      localStorage.setItem('baseUrl', baseUrls[net])
      this.$router.go(0)
    },
    handleSelect (key) {
      if (key !== 'hide') {
        this.$router.push({ name: key })
      }
    },
    goPages () {
      let searchDomain = this.search.trim() + ''
      if (searchDomain) {
        if (searchDomain.length <= 10 && !isNaN(searchDomain)) {
          return jumpToBlock(searchDomain, this)
        }
        try {
          isBCHCashAddress(searchDomain)
          return jumpToAddress(searchDomain, this)
        } catch (e) {
        }
        if (searchDomain.length === 64) {
          if (searchDomain.substr(0, 8) === '00000000') {
            return jumpToBlock(searchDomain, this)
          }
          return jumpToTxHash(searchDomain, this)
        }
      }
      return popup.error(this.$t('nav.searchError'), this, 1500)
    }
  },
  computed: {
    ...mapState(['activeRoute']),
    lanDes: vm => {
      return vm.$i18n.locale === 'en' ? 'English' : '中文'
    }
  },
  created () {
    this.getNet()
  },
  mounted () {
    const clickNode = this.$refs['handlerInput'].childNodes[0].childNodes[3].childNodes[0].childNodes[0]
    clickNode.addEventListener('click', () => {
      this.goPages()
    })
  }
}
</script>

<style lang="scss">
    .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover{
        background-color: #fff!important;
        color: #0c66ff!important;
    }
    .nav-container {
        height: 100px;
        box-shadow: 0 10px 10px 0 rgba(96, 131, 191, 0.04), 0 0 1px 0 rgba(96, 131, 191, 0.04);
        display: flex;
        flex-direction: row;
        align-items: center;
        .drop-style {
            font-size: 16px;
            color: #909399;
            cursor: pointer;
            margin: 0 20px;
        }
        .hide-style {
            display: none;
        }
        .nav-box {
            width: 1216px;
            margin: 0 auto;
            .el-row {
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
            }
            .img-container {
                margin-right: 39px;
                .wm-logo {
                    width: 189px;
                }
            }
            .input-container {
                margin-left: 13px;
                .el-icon-search {
                    font-size: 20px;
                    cursor: pointer;
                }
                .el-input__inner {
                    border-radius: 36.5px!important;
                }
            }
        }
    }
</style>
