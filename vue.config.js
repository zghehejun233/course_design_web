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
  outputDir: 'E:\\NewTeachFrame\\java-client\\dist',
  // outputDir: 'C:\\teach\\teach-server\\src\\main\\resources\\public'
}   