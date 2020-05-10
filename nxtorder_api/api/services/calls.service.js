const Promise = require('bluebird');
const moment = require('moment');
const Calls = require('../models/call.model');
const Msg = require('../../config/strings');

exports.create = function (callObj) {
//    const startTime=moment(callObj.callStartTime).format('DD-MM-YYYY HH:MM:SS').split(' ');
//    const startTime=moment(callObj.callStartTime).format('DD-MM-YYYY HH:MM:SS')
////    const endTime=moment(callObj.callEndTime).format('DD-MM-YYYY HH:MM:SS').split(' ');
//    const endTime=moment(callObj.callEndTime).format('DD-MM-YYYY HH:MM:SS')
//    const time = moment(endTime.diff(moment(startTime))).format("HH:mm:ss")
//    console.log(startTime,endTime,time, "startTimestartTime");
//    return ;
    return Calls.create(callObj)
            .then(function (favourites) {
                return Promise.resolve(favourites);
            }).catch(function (err) {
        if (err.name === 'ValidationError') {
            var err1 = new Error(err.message);
            err1.status = 400;
            return Promise.reject(err1);
        }
        var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
        err2.status = 500;
        return Promise.reject(err2);
    });
}
exports.view = function (callId) {
    return Calls.findById(callId).exec().then(function (cart) {
        if (cart.deleted) {
            var err2 = new Error(Msg.USER_NOT_EXISTS);
            err2.status = 204;
            return Promise.reject(err2);
        }
        return Promise.resolve(cart);
    })
};
exports.getItemsAll = function (user_id) {
    return Calls.find({deleted: {$exists: false}, "user._id": user_id}).exec();
};