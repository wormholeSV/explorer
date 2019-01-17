var config = {
  devServer: {
    port: 8080,
    proxy: {
      '/mainnetapi': {
        target: process.env.EXPLORER_MAINNETAPI_URL,
        pathRewrite: { '^/mainnetapi': process.env.EXPLORER_MAINNETAPI_PATH }
      },
      '/testnetapi': {
        target: process.env.EXPLORER_TESTNETAPI_URL,
        pathRewrite: { '^/mainnetapi': process.env.EXPLORER_TESTNETAPI_PATH }
      }
    }
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
