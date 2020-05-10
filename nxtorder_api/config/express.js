'use strict'

/** External modules **/
const express = require('express');
const bodyParser = require('body-parser');

/** Internal modules **/
const config = require('.');
const Msg = require('./strings');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   
    extended: true
}));

app.use('/public', express.static(config.rootPath + '/public'));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-header-app-version, x-header-os-type, x-header-authtoken, refreshToken, role");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');

    if (req.method == 'OPTIONS') {
        return res.send(200);
    }
    next();
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    var errorMessage = config.env === "development" ? err : Msg.INTERNAL_SERVER_ERROR
     console.log("innnnnnnnnnnnnnnn parseee", errorMessage,err)
    res.send({
        
        success: false,
        result: { error: err.message, message: errorMessage }
    });
});

var appRoutes = require('../routes');
app.use('/', appRoutes);

exports.start = () => {
    app.listen(config.port, (err) => {
        if (err) {
            console.log(`Error : ${err}`)
            process.exit(-1)
        }
        console.log(`${config.app} is running on ${config.port}`)
    })
}

exports.app = app