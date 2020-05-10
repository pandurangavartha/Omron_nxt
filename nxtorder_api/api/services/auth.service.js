/** External modules **/
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

/** Internal modules **/
const config = require('../../config');
const CryptoService = require('../services/crypto.service');
const redisClient = require('../../config/redis').redisClient;

exports.createToken = function (user) {
    //Create a Token and send the response
    var userDetails = {
        username: user.username, name: user.name, _id: CryptoService.encrypt(user.id)
    };
    var token = jwt.sign(userDetails, config.jwtSecret, {
        expiresIn: config.authExpiry
    });
    return token;
};

exports.createRefreshToken = function (user) {
    //Create a Token and send the response
    var userDetails = {
        username: user.username, name: user.name, _id: CryptoService.encrypt(user.id)
    };
    var refreshToken = jwt.sign(userDetails, config.jwtRefreshSecret, {
        expiresIn: config.refreshExpiry
    });
    return refreshToken;
};


exports.verifyToken = function (token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, config.jwtSecret, function (err, decoded) {
            if (err) {
                return reject(err)
            }
            decoded._id = CryptoService.decrypt(decoded._id);
            return resolve(decoded);
        });
    })
}

exports.verifyRefreshToken = function (token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, config.jwtRefreshSecret, function (err, decoded) {
            if (err) {
                return reject(err)
            }
            decoded._id = CryptoService.decrypt(decoded.id);
            return resolve(decoded);
        });
    })
}

exports.checkTokenInRedis = function (token) {
    return new Promise(function (resolve, reject) {
        redisClient.hget(token, "userId", function (err, value) {
            if (err) {
                return reject(err);
            }
            if (!value) {
                return reject(new Error("Please sign in"));
            }
            return resolve(value)
        });
    });
}

exports.deleteTokenFromRedis = function (token) {
    return new Promise(function (resolve, reject) {
        redisClient.del(token, function (err, status) {
            if (err) {
                return reject(err);
            }
            return resolve(status)
        })
    });
}