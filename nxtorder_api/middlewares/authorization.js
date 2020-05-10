/** External modules **/
const _ = require('lodash');

/** Internal modules **/
const Msg = require('../config/strings')
const AuthService = require('../api/services/auth.service');
const redisClient = require('../config/redis').redisClient;

exports.requiresLogin = function (req, res, next) {
console.log("in loginnn")
    AuthService.checkTokenInRedis(req.headers[Msg.HEADER_AUTH_TOKEN])
        .then(function (redisdata) {
            
            console.log("innnnnn token")
            return AuthService.verifyToken(req.headers[Msg.HEADER_AUTH_TOKEN])
        }).then(function (payload) {
//            console.log("innnnnn token1111")
            req.user = payload;
            return null;
        }).catch(function (err) {
//            console.log("innnnnn token222222")
            if (err.name === 'TokenExpiredError') {
                return AuthService.verifyRefreshToken(req.headers.refreshtoken)
            }
            throw err;
        }).then(function (payload) {
            console.log("in payload")
            if (!payload) {
                return next();
            } else {
                req.user = payload;
                var tokens = {};
                tokens.authToken = AuthService.createToken(payload);
                tokens.refreshToken = AuthService.createRefreshToken(payload);

                //deleting old tokens from redis
                AuthService.deleteTokenFromRedis(req.headers[Msg.HEADER_AUTH_TOKEN]);

                //storing tokens in redis with "authToken" as key and [userId , refreshToken] as value
                redisClient.hmset(tokens.authToken, "userId", req.user._id.toString(), Msg.HEADER_REFRESH_TOKEN, tokens.refreshToken, redis.print).then(() => done())
.catch(done);

                res.tokens = tokens;
                return next();
            }
        }).catch(function (err) {
            res.status(401);
            console.log("errrrrrrrrrrrrr", err)
            return res.json({ success: false, result: { error: Msg.UNAUTHORISED } });
        })
};