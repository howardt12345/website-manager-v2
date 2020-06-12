const {alias} = require('react-app-rewire-alias')

module.exports = function override(config) {

  alias({
    '@api': 'src/api',
    '@components': 'src/components',
    '@pages': 'src/pages',
    '@routes': 'src/routes',
    '@styles': 'src/styles',
    '@utils': 'src/utils',
  })(config)

  return config
}