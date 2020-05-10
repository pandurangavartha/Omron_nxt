/** External modules */
const _ = require('lodash');
const path = require('path');

const env = require(path.join(__dirname, `env/${process.env.NODE_ENV}.js`));
const common = require(__dirname + '/env/common');
module.exports = _.extend(common, env || {});