'use strict'
/**
 * app.js
 *
 * Main execution file for this project.
 */
require('./config/mongoose')
const app = require('./config/express')

// start app
app.start();

module.exports = app