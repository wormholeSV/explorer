<template lang="pug">
  div(id="app")
      nav-bar
      el-container
          el-main
            keep-alive
                router-view(:key="$route.fullPath")
      index-footer

</template>
<script>
import NavBar from './commonComponents/NavBar'
import IndexFooter from './commonComponents/Footer'
import { mapMutations } from 'vuex'

export default {
  components: { NavBar, IndexFooter },
  methods: {
    ...mapMutations(['changeActiveRoute'])
  },
  watch: {
    $route (to) {
      let nameArray = [ 'home', 'block', 'assets' ]
      let nameStatus = nameArray.some((item) => {
        return to.name === item
      })
      let routeName
      nameStatus ? routeName = to.name : routeName = 'hide'
      this.changeActiveRoute(routeName)
    }
  }
}
</script>
<style lang="scss">
body {
    margin: 0;
}
.ellipsis {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
#app {
  font-family: NotoSansHans,'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-menu.el-menu--horizontal {
    border: none;
}
.el-menu-item {
    font-size: 16px;
    padding: 0 0!important;
    margin: 0 20px!important;
}
.el-submenu__title {
    font-size: 16px;
}
.el-menu--horizontal>.el-menu-item.is-active {
    color: #0c66ff;
    border-bottom: 0.125rem solid #0c66ff;
    font-weight: 500;
}
.el-container {
    margin: 0 auto;
    .el-header {
        padding: 0;
    }
    .el-main {
        padding: 0;
    }
}
.click-pointer {
    cursor: pointer;
    color: #0c66ff!important;
    text-decoration: none;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #0c66ff;
}
.el-pagination.is-background .el-pager li, .btn-prev, .btn-next {
    color: #a6aebc;
}
.el-tabs__item {
    color: #53627c;
}
.el-tabs__item.is-active {
    color: #0c66ff;
}
</style>
