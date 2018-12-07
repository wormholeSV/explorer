var config = {
  devServer: {
    port: 8080,
    proxy: 'https://dev.wormhole.cash'
  },
  pluginOptions: {},
  transpileDependencies: [
    /\/node_modules\/vue-echarts\//,
    /\/node_modules\/resize-detector\//
  ],
  baseUrl: process.env.GLOBAL_BASE_URL,
  configureWebpack: {
    externals: {}
  }
}

module.exports = config
