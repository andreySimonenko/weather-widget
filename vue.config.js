const NODE_ENV = process.env.NODE_ENV === 'development'
  ? 'development'
  : 'production'

module.exports = {
  lintOnSave: false,
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Прогноз погоды',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  publicPath: NODE_ENV === 'production'
    ? '/weather-widget/'
    : '/'
}
