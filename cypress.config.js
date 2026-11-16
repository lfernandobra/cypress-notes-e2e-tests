const { defineConfig } = require('cypress')
const { plugin: cypressGrepPlugin } = require('@cypress/grep/plugin')

module.exports = defineConfig({
  expose: {
    viewportWidthBreakpoint: 768,
  },
  e2e: {
    baseUrl: 'https://notes-serverless-app.com',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      cypressGrepPlugin(config)
      return config
    },
  },
})
