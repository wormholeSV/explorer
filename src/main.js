import Vue from 'vue'
import Vuex from 'vuex'

import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'
import './plugins/axios'
import VueVisible from 'vue-visible'
import VueI18n from 'vue-i18n'
import { DropdownItem, DropdownMenu, Dropdown, TabPane, Tabs, Tooltip, Option, Select, Footer, Pagination, Message, Loading, Table, TableColumn, Button, Menu, MenuItem, MenuItemGroup, Submenu, Container, Header, Main, Row, Col, Input, DatePicker, Popover } from 'element-ui'
import ElementLocale from 'element-ui/lib/locale'
import VueClipboard from 'vue-clipboard2'

import messages from './message'

Vue.use(Button)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Container)
Vue.use(Header)
Vue.use(Row)
Vue.use(Col)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Main)
Vue.use(Input)
Vue.use(Table)
Vue.use(Loading)
Vue.use(Footer)
Vue.use(Select)
Vue.use(Option)
Vue.use(Pagination)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tooltip)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.use(VueI18n)
Vue.use(VueVisible)
Vue.use(VueClipboard)
Vue.prototype.$message = Message
Vue.config.productionTip = false

Vue.use(Vuex)
// International Language

const i18n = new VueI18n({
  locale: 'en',
  messages
})

const lan = navigator.language || navigator.browserLanguage || 'en'
ElementLocale.i18n((key, value) => i18n.t(key, value))

// Hot updates
if (module.hot) {
  module.hot.accept(['./message/en', './message/zh'], function () {
    i18n.setLocaleMessage('en', require('./message/en').default)
    i18n.setLocaleMessage('zh', require('./message/zh').default)
  })
}
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

if (localStorage.getItem('lan')) {
  i18n.locale = localStorage.getItem('lan')
} else {
  if (lan === 'zh' || lan === 'zh-CN' || lan === 'zh-TW') {
    i18n.locale = 'zh'
  } else {
    i18n.locale = 'en'
  }
}
