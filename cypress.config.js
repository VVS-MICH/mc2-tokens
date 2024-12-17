const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    watchForFileChanges: false,
    viewportHeight: 1080,
    viewportWidth: 1920,
    baseUrl: "https://app.mc2.fi/",
    pageLoadTimeout: 120000,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});