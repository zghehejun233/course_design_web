module.exports = {
  publicPath: './',
  devServer: {
    hot: true,
    disableHostCheck: true,
    https: false,
    proxy: {
      '^/api':
      {
        target: 'http://localhost:9090',
        changeOrigin: true
      },

    },
  },
  outputDir: './dist/',
}   