/** External modules **/
const _ = require('lodash');

/** Internal modules **/
const config = require('../config')
const Msg = require('../config/strings')

exports.validateHeaders = function (req, res, next) {
    console.log("in headersssssssssss")
    if (!req.headers[Msg.HEADER_OS_TYPE]) {
        return res.status(400).send({
//            message: Msg.MISSING_OS_TYPE ,
            result: {error: Msg.MISSING_OS_TYPE}
        })
    }
    if (!req.headers[Msg.HEADER_APP_VERSION]) {
        console.log("in headersssssssssss2222222222222")
        return res.status(400).send({
//            message: Msg.MISSING_APP_VERSION 
            result: {error: Msg.MISSING_APP_VERSION}
        });
    }

    if (req.headers[Msg.HEADER_OS_TYPE].toLowerCase() != "android") {
        console.log("in headersssssssssss3333333333")
        return res.status(400).send({
//            message: Msg.INVALID_OS_TYPE 
            result: {error: Msg.INVALID_OS_TYPE }
        })
    }

    if (req.originalUrl !== '/user/login' && req.originalUrl !== '/user/login/otp' && req.originalUrl !== '/user/otp' && (req.originalUrl !== '/users/') && req.method !== "POST"
            && req.originalUrl !== '/products' && req.originalUrl !== '/vendor') {
//        console.log("innnnnnnnnnnnn auth token", req.headers[Msg.HEADER_AUTH_TOKEN])
        if (!req.headers[Msg.HEADER_AUTH_TOKEN]) {
            console.log("innnnnnnnnnnnn auth token")
            return res.status(400).send({
//                message: Msg.MISSING_ACCESS_TOKEN
                result: { error: Msg.MISSING_ACCESS_TOKEN }
            })
        }

        if (!req.headers[Msg.HEADER_REFRESH_TOKEN]) {
            console.log("in headersssssssssss444444444444")
            return res.status(400).send({
//                message: Msg.MISSING_REFRESH_TOKEN
                result: { error: Msg.MISSING_REFRESH_TOKEN }
            })
        }
    }

    if (_.indexOf(config.deprecatedAppVersions, req.headers[Msg.HEADER_APP_VERSION]) > -1) {
        console.log("in headersssssssssss55555555555")
        return res.status(426).send({
//            message: Msg.NEW_APP_VERSION
            result: { error: Msg.NEW_APP_VERSION }
        });
    }

    return next();
}