module.exports = {
  devServer: {
    port: 3000,
    proxy: {
      '^/api': {
        target: 'http://localhost:3010',
        ws: true,
        changeOrigin: true
      },
      '^/upload': {
        target: 'http://localhost:3010',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
