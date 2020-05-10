const Promise = require('bluebird');
const qrcode = require('qrcode');
const User = require('../models/user.model');
const Order = require('../models/order.model');
const Store = require('../models/store.model');
const Msg = require('../../config/strings');
const qr = require('qr-image');
const fs = require('fs');
exports.registerUser = function (userObj) {
//    console.log("innnnnnnnnnnnnnnnn")
//    var query = {
//        mobile
//    }
    return User.findOne({
        $or: [
            {username: userObj.username, },
            {mobile: userObj.mobile}
        ]
    }).exec()
            .then(function (user) {
                console.log(user, "useruseruser")
                if (user) {
                    var err = new Error(Msg.USER_EXISTS);
                    err.status = 409;
                    return Promise.reject(err);
//                    if (user.mobile == userObj.mobile) {
//                        console.log("inn mobilee")
////                    var err = new Error(Msg.USER_EXISTS);
//                        var err = "Mobile Number already exists.";
//                        err.status = 409;
//                        return Promise.reject(err);
//                    }
                }
                var code = randomStr(8);
                var qr_png = qr.imageSync(code, {type: 'png'})
                let qr_code_file_name = new Date().getTime() + '.png';
                userObj.qrCode = code;
                userObj.qrCodeImage = qr_code_file_name;
                fs.writeFileSync('./public/qr_images/' + qr_code_file_name, qr_png, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
                return User.create(userObj)
                        .then(function (user) {
                            return Promise.resolve(user);
                        }).catch(function (err) {
                    console.log(err, "errr")
                    if (err.name === 'ValidationError') {
                        var err1 = new Error(err.message);
                        err1.status = 400;
                        return Promise.reject(err1);
                    }
                    var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
                    err2.status = 500;
                    return Promise.reject(err2);
                });
            }).catch(function (err) {
        console.error(err, "iiiiiiiii");
        return Promise.reject(err);
    });
};

exports.createToken = function (reqObj, os, roleHeader) {

    return User.findOne({
        username: reqObj.username,
    }).exec().then(function (user) {
        console.log(user, "useruseruseruser")
        if (!user) {
            var err = new Error(Msg.INVALID_USERNAME);
            err.status = 204;
            console.log(err, "1111111111111111111111111111111111111111111")
            return Promise.reject(err)
        }

        if (user.deleted) {
            var err2 = new Error(Msg.USER_DEACTIVATED);
            err2.status = 203;
            return Promise.reject(err2);
        }

        if (user.status !== 'Active') {
            var err2 = new Error(Msg.USER_DEACTIVATED);
            err2.status = 203;
            return Promise.reject(err2);
        }

        if (user.createToken(reqObj.password)) {
            if (reqObj.deviceToken) {
                user.deviceTokens[os].addToSet(reqObj.deviceToken);
            }
            return user.save().then(function (data, err) {
                if (err)
                    throw err
                return Promise.resolve(data);
            });
        } else {
            var err3 = new Error(Msg.INVALID_PASSWORD);
            err3.status = 204;
            return Promise.reject(err3)
        }
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};

exports.createTokenWithOTP = function (reqObj, os, roleHeader) {
    return User.findOne({
//        username: reqObj.username
        mobile: reqObj.mobile
    }).exec().then(function (user) {
        console.log(user, "userrrrrrrrrr")
        if (user) {
            console.log("in usersssssssssss")
            if (!user) {
                console.log("in invalidddddddd")
                var err = new Error(Msg.INVALID_USERNAME);
                err.status = 204;
                return Promise.reject(err)
            }

            if (user.deleted) {
                var err = new Error(Msg.USER_DEACTIVATED);
                err.status = 203;
                return Promise.reject(err);
            }
            console.log(user.otp, reqObj.otp, "reqqqqqqqqqqqq")

            if (user.otp === reqObj.otp) {
                console.log("in otpppppppppp")
                if (reqObj.deviceToken) {
                    user.deviceTokens[os].addToSet(reqObj.deviceToken);
                }
                return user.save().then(function (data, err) {
                    if (err)
                        throw err

                    return Promise.resolve(data);
                });
            } else {
                console.log("innnnnnnnnnn")
                var err = new Error(Msg.INVALID_OTP);
                err.status = 204;
                return Promise.reject(err)
            }
        }

    }).catch(function (err) {
        if (err.name === 'ValidationError') {
            var err1 = new Error(err.message);
            err1.status = 400;
            return Promise.reject(err1);
        }
        console.log("innnnnnnnnnnnn errorrr")
        var err2 = new Error(Msg.INTERNAL_SERVER_ERROR);
        err2.status = 500;
        return Promise.reject(err2);
    });
};

exports.setPassword = function (reqObj, os, roleHeader) {
    return User.findOne({
        username: reqObj.username
    }).exec().then(function (user) {
        if (!user) {
            var err = new Error(Msg.INVALID_USERNAME);
            err.status = 204;
            return Promise.reject(err)
        }

        if (user.deleted) {
            var err = new Error(Msg.USER_DEACTIVATED);
            err.status = 203;
            return Promise.reject(err);
        }

        if (user.otp === reqObj.otp && user.createToken(reqObj.password)) {
            return user.save().then(function (data, err) {
                if (err)
                    throw err;
                return Promise.resolve(data);
            });
        } else {
            var err = new Error(Msg.INVALID_OTP);
            err.status = 204;
            return Promise.reject(err)
        }
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};

exports.logout = function (userId, os, deviceToken) {
    return User.findById(userId)
            .then(function (user) {
                user.deviceTokens[os].pull(deviceToken)
                return user.save().then(function (data, err) {
                    if (err)
                        throw err;
                    return Promise.resolve(data)
                });
            }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};

exports.getProfile = function (userId) {
    return User.findById(userId).exec().then(function (data) {
        return Promise.resolve(data)
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};

exports.updateProfile = function (user, userId) {
    return User.findOne({
        "_id": userId,
    }).exec().then(function (userData) {
        var percentage = userData.profilePercentage;
        if (userData.basicPercentage !== 0) {

            percentage = percentage + userData.basicPercentage;
            user.basicPercentage = 0;
            console.log("innnnnnnnnnn111", )
        }
        if (userData.addressPercentage !== 0) {
            percentage = percentage + userData.addressPercentage;
            console.log("innnnnnnnnnn22222", percentage, userData.addressPercentage)
            user.addressPercentage = 0;
            console.log("innnnnnnnnnn111")
        }
        if (userData.interestsPercentage !== 0) {
            percentage = percentage + userData.interestsPercentage;
            console.log("innnnnnnnnnn33333", percentage, userData.interestsPercentage)
            user.interestsPercentage = 0;
            console.log("innnnnnnnnnn111")
        }
        user.profilePercentage = percentage;
        return User.findByIdAndUpdate(userId, user, {
            new : true,
            runValidators: true
        }).catch(function (err) {
            console.error(err);
            return Promise.reject(err);
        });
    })
};

exports.updateProfileWithOtp = function (user, mobile) {
    console.log(mobile, user.otp, "tttttttttt")
    return User.update({mobile: mobile}, {$set: {otp: user.otp}}, {
        new : true,
        runValidators: true
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};

exports.otpVerification = function (mobile, otp) {
    console.log(mobile, otp, "tttttttttt")
    var query = {
        mobile: mobile,
        otp: otp,
//        id
    }
    return User.findOne(query).exec().then(function (data) {
        console.log(data, "dataaaaaaa")
        return Promise.resolve(data)
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};

exports.profileDeactivate = function (userId) {
    return User.findByIdAndUpdate(userId, {status: "InActive"}, {
        new : true,
        runValidators: true
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};

exports.profileActivate = function (userId, req) {
    console.log("in activeee")
    
//    return User.findByIdAndUpdate(userId, {status: "Active"}, {
    return User.findByIdAndUpdate(userId, {status: req.status}, {
        new : true,
        runValidators: true
    }).catch(function (err) {
        console.error(err, "eroorrrr");
        return Promise.reject(err);
    });
};

exports.all = function (req) {

    var query = {
        deleted: {$exists: false},
        
    };

    if (req.status) {
        query.status = req.status
    }
    if (req.role_type == "Customer") {
        query.roles = req.role_type
    }
    if (req.role_type == "Vendor") {
        query = {
            deleted: {$exists: false},
            $and:[{
                roles : {$ne:"Customer"}
            },{
                roles : {$ne:"NxtOrderAdmin"}
            }]
//            $ne : {roles:"Customer"}

             
//            ne : {roles:"Customer", roles:"NxtOrderAdmin"}
        }
        console.log("innnnnn", query)
//         query = {
////        "industry._id": industryId,
//        $and: [
//            {$or: [{"roles": category}]},
//            {$or: [{brand: brand}]},
////            {$or: [{"industry._id": industryId}]},
//            {$or: [{deleted: {$exists: false}}]}
//        ]
//    }
    }
    if (req.firstName) {
        query.firstName = new RegExp(req.firstName, 'i')
    }

    if (req.lastName) {
        query.lastName = new RegExp(req.lastName, 'i')
    }

    return User.find(query).then(function (users) {
        return users
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    })
};

exports.myOrders = function (userId, req) {
    var query = {};

    query["user._id"] = userId

    if (req.orderType) {
        query["orderType"] = req.orderType
    }

    if (req.storeName) {
        query["store.storeName"] = req.storeName
    }

    return Order.find(query).then(function (orders) {
        return orders
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    })
};

exports.myStores = (req, userId) => {

    var query = {
        deleted: {$exists: false}
    };

    query["owner._id"] = userId
    query["status"] = 'Active'

    if (req.storeName) {
        query.storeName = new RegExp(req.storeName, 'i')
    }

    return Store.find(query).sort({storeName: 1}).then(function (data) {
        return Promise.resolve(data);
    }).catch(function (err) {
        return Promise.reject(err);
    });
};
exports.address = (userId) => {
    console.log(userId, "userIduserIduserId")
    var query = {
        "_id": userId,
    }
    return User.findById(userId).exec().then(function (data) {
        console.log(data, "dataaaaaaa")
        return Promise.resolve(data)
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};

exports.getIndividualaddress = (userId, addressId) => {
    console.log(userId, "userIduserIduserId")
    var query = {
        "_id": userId,
        "addresses._id": addressId,
    }
    return User.findById(query).exec().then(function (data) {
        console.log(data, "dataaaaaaa")
        return Promise.resolve(data)
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
};

exports.addNewAddress = (userObj, userId) => {
    var query = {
        deleted: {$exists: false},
        _id: userId,
//        "categories._id": categoryId,
//        "subcategories._id": subcategoryId
    }
//    return Product.findOneAndUpdate({ _id: productId, deleted: { $exists: false } }, { $addToSet: { variants: variantsList } }, {
    return User.findOneAndUpdate(query, {$addToSet: {addresses: userObj}}, {
        new : true,
        runValidators: true
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
};

exports.deleteAddress = function (addressId, userId) {
    var query = {
//        deleted: {$exists: false},
        _id: userId,
        "addresses._id": addressId,
    }
    return User.findOneAndUpdate(query, {'$pull': {addresses: {_id: addressId}}}, {
        new : true,
        runValidators: true
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
};
exports.updateAddressDetails = function (addressDetails, userId, addressId) {
    console.log("innnnnnnn", addressDetails)
    return User.findOneAndUpdate(
            {_id: userId,
                deleted: {$exists: false},
                "addresses._id": addressId},
            {$set: addressDetails}, {
        new : true,
        runValidators: true
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
};
function randomStr(len, arr) {
//    for (var i = len; i > 0; i--) {
//        ans +=
//                arr[Math.floor(Math.random() * arr.length)];
//    }
    var digits = "0123456abcd"
    let string = '';
    for (let i = 0; i < len; i++) {
        string += digits[Math.floor(Math.random() * digits.length)];
    }
    return string;
}
exports.getQRCode = function (userId) {
    var query = {
        "_id": userId,
    }
    return User.findById(query).exec().then(function (data) {
        return data;
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
}
//exports.getQRCode = function (userId) {
//    var code = randomStr(8);
//    var qr_png = qr.imageSync(code.qrCode, {type: 'png'})
//    let qr_code_file_name = new Date().getTime() + '.png';
//
//    return User.findOneAndUpdate({_id: userId}, {$set: {qrCode: code, qrCodeImage: qr_code_file_name}}, {
//        new : true,
//        runValidators: true
//    }).catch(function (err) {
//        console.error(err);
//        return Promise.reject(err);
//    });
//}

exports.qrCodeVerification = function (userId) {
    var query = {
        "_id": userId,
    }
    return User.findById(query).exec().then(function (data) {
        return data;
    }).catch(function (err) {
        console.error(err);
        return Promise.reject(err);
    });
}

exports.review = function (user, userId) {
    return User.findOne({
        "_id": userId,
    }).exec().then(function (userData) {
        console.log(userId, "usssssssssssss")
        return User.findByIdAndUpdate(userId, user, {
            new : true,
            runValidators: true
        }).catch(function (err) {
            console.error(err);
            return Promise.reject(err);
        });
    })
};