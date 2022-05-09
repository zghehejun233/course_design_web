module.exports = {
  publicPath: './',
  devServer: {
    hot: true,
    disableHostCheck: true,
    https: false,
    proxy: {
      '^/api':
      {
        target: 'http://47.100.74.245',
        changeOrigin: true
      },

    },
  },
  outputDir: './dist/',
}   