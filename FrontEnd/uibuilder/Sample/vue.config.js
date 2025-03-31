module.exports = {
  devServer: {
    proxy: {
      '/api-basic-v1': {
        target: 'http://betaapi.unicv.cv',
        changeOrigin: true,
        pathRewrite: { '^/api-basic-v1': '/api-basic-v1' },
      },
    },
  },
};
