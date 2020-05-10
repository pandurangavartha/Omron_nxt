'use strict'

/** External modules */
const mongoose = require('mongoose')
const defaultService = require('../api/services/default.service')

/** Internal modules */
const config = require('.')

mongoose.Promise = global.Promise;

if (config.env === 'development') {
    mongoose.set('debug', true)
}

mongoose.connect(config.mongo.uri, {
    keepAlive: 1, useNewUrlParser: true, useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB is connected')
    defaultService.createDefaultRecords()
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB is disconnected')
});

mongoose.connection.on('error', (err) => {
    console.log(`Could not connect to MongoDB because of ${err}`)
    process.exit(-1)
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});