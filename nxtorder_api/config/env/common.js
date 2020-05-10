const path = require('path');
const rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    rootPath: rootPath,
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    app: "Nxt-Order API Server",
    deprecatedAppVersions: ["1.0.0"],
    jwtSecret: "supersecretkey",
    jwtRefreshSecret: "superRefreshsecretkey",
    cryptoKey: "1234567890abcdefghijklmnopqrstuv",
};