const Promise = require('bluebird');

const Plan = require('../models/plans.model');
const Msg = require('../../config/strings');
const _ = require('lodash');
const User = require('../models/user.model');

exports.create = function (planObj) {
    return Plan.findOne({
        planName: planObj.planName,
//        deleted: false
    }).exec().then(function (plans) {
        console.log(plans, "plans")
        if (plans) {
            console.log("innnn plan duplicate")
            var err = new Error(Msg.PLAN_EXISTS);
            err.status = 409;
            return Promise.reject(err);
        }
        console.log(planObj, "plannnnnnnnnnn")
        if (planObj.user) {
            return User.findById(planObj.user)
                    .then(function (user) {
                        console.log(user, "userrrrrrrr")
                        if (!_.isEmpty(user)) {
                            var user = {
                                "_id": user.id,
                                "name": user.firstName,
                                "username": user.username
                            }
                            console.log()
                        } else {
                            user = null
                        }
                        planObj.user = user;
                        console.log(planObj, "plannnnnnnn")
                        return Plan.create(planObj)
                                .then(function (plan) {
                                    return Promise.resolve(plan);
                                }).catch(function (err) {
                            if (err.name === 'ValidationError') {
                                var err1 = new Error(err.message);
                                err1.status = 400;
                                return Promise.reject(err1);
                            }
                            console.log(err.message, "kkkkkkk")
                            var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
                            err2.status = 500;
                            return Promise.reject(err2);
                        });
                    })

        }

    })
};

exports.update = function (plan, planId) {
    return Plan.findByIdAndUpdate(planId, plan, {
        new : true,
        runValidators: true
    });
};

exports.view = function (planId) {
    return Plan.findById(planId);
};

exports.delete = function (roleId) {
    return Plan.findByIdAndUpdate(roleId, {deleted: true}, {
        new : true,
        runValidators: true
    });
};

exports.getAll = function () {
    return Plan.find({deleted: {$exists: false}}).then(function (data) {
        return Promise.resolve(data);
    });
};
exports.planActivate = function (planId, status) {
    return Plan.findByIdAndUpdate(planId, {isActive: status}, {
        new : true,
        runValidators: true
    }).catch(function (err) {
        console.error(err, "eroorrrr");
        return Promise.reject(err);
    });
};