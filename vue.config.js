const NODE_ENV = process.env.NODE_ENV === 'development'
  ? 'development'
  : 'production'

module.exports = {
  lintOnSave: false,
  publicPath: NODE_ENV === 'production'
    ? '/weather-widget/'
    : '/'
}
