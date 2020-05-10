const VendorService = require('../services/vendor.service');
const shortid = require('shortid');
const Msg = require('../../config/strings');
const redis = require('../../config/redis');
const redisClient = redis.redisClient
const AuthService = require('../services/auth.service');
const Request = require("request");
exports.register = function (req, res, next) {
    var userObj = req.body;
//    userObj.mobile = req.body.mobile;
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    userObj.otp = OTP
//    Request.get("https://smsapi.iton.in/api?username=scienstech&password=Sciens@123&cmd=sendSMS&to=" + req.body.mobile + "&sender=NXTORD&message=4545", (error, response, body) => {
    Request.get("http://www.metamorphsystems.com/index.php/api/bulk-sms?username=sciens &password=Sciens@123&from=NXTORD&to=" + req.body.mobile + "&sender=NXTORD&message=" + OTP, (error, response, body) => {
        if (error)
            throw error
        console.log(error, "erooorr")
        console.log(body, "bodyyyyyyyyyyyyyy")
        VendorService.registerUser(userObj).then(function (user) {
            delete user.responseJSON().qrCode;
            delete user.qrCodeImage;
            return res.json({result: user.responseJSON()});
        }).catch(function (err) {
            console.log("in eroor", err)
            return res.status(400).send({result: {error: err.message}})
        });
    });
};

exports.update = function (req, res, next) {
    var userObj = req.body
    if (req.body.longitude && req.body.latitude) {
        userObj.currentPosition = [req.body.longitude, req.body.latitude]
    }
    if (req.body.gender) {
        userObj.gender = req.body.gender
    }
    if (userObj.languagesSpoken) {
        userObj.languagesSpoken = userObj.languagesSpoken
    }
    delete userObj.status;
    delete userObj.deviceToken;
    if (req.file) {
        userObj.profilePicture = req.file.path
    }
    if (userObj.interests) {
        userObj.interests = JSON.parse(userObj.interests)
        console.log(typeof userObj.interests, "userObjuserObj")
    }
    var vendorProfile={};
    if (userObj.panNumber) {
        userObj.panNumber = userObj.panNumber
    }
    if (userObj.companyName) {
        userObj.companyName = userObj.companyName
    }
    if (userObj.qualification) {
        userObj.qualification = userObj.qualification
    }
    if (userObj.designation) {
        userObj.designation = userObj.designation
    }
    if (userObj.sellerType) {
        userObj.sellerType = userObj.sellerType
    }
    console.log(userObj, "userObjuserObj",vendorProfile)
//    return false;
//    if(userObj.addresses) {
//        userObj.addresses["_id"] = shortid.generate()
//        
//    }
    VendorService.updateProfile(userObj, req.params.user_id,vendorProfile)
            .then(function (user) {
                return res.send({result: user});
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};


exports.createToken = function (req, res, next) {
    var userObj = req.body;
    var tokens = {};
    UserService.createToken(userObj, req.headers[Msg.HEADER_OS_TYPE].toLowerCase()).then(function (user) {
        //creating tokens
        tokens.authToken = AuthService.createToken(user);
        tokens.refreshToken = AuthService.createRefreshToken(user);

        user.accessToken = tokens.authToken
        user.refreshToken = tokens.refreshToken
        //storing tokens in redis
        redisClient.hmset(tokens.authToken, "userId", user.id.toString(), Msg.HEADER_REFRESH_TOKEN, tokens.refreshToken, redis.print);

        return res.status(200).send({result: user.responseJSON()});
    }).catch(function (err) {
        console.log("In error", err)
        return res.status(400).send({result: {error: err.message}})
    });

};

exports.createTokenWithOTP = function (req, res, next) {
    var userObj = req.body;
    var tokens = {};
    UserService.createTokenWithOTP(userObj, req.headers[Msg.HEADER_OS_TYPE].toLowerCase()).then(function (user) {

        //creating tokens
        tokens.authToken = AuthService.createToken(user);
        tokens.refreshToken = AuthService.createRefreshToken(user);

        user.accessToken = tokens.authToken
        user.refreshToken = tokens.refreshToken

        //storing tokens in redis
        redisClient.hmset(tokens.authToken, "userId", user.id.toString(), Msg.HEADER_REFRESH_TOKEN, tokens.refreshToken, redis.print);

        return res.status(200).send({result: user.responseJSON()});
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });

};

exports.generateOTP = function (req, res, next) {
    if (!req.body.username) {
        return res.status(400).send({result: {error: Msg.BAD_REQUEST}})
    }
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    var userObj = {
        otp: OTP
    }
//    Request.get("https://smsapi.iton.in/api?username=scienstech&password=Sciens@123&cmd=sendSMS&to=" + req.body.username + "&sender=NXTORD&message=4545", (error, response, body) => {
//    Request.get("http://www.metamorphsystems.com/index.php/api/bulk-sms?username=sciens &password=Sciens@123&from=NXTORD&to=" + req.body.username + "&sender=NXTORD&message=" + OTP, (error, response, body) => {
    Request.get("http://www.metamorphsystems.com/index.php/api/bulk-sms?username=sciens &password=Sciens@123&from=NXTORD&to=" + req.body.username + "&sender=NXTORD&message=" + OTP, (error, response, body) => {
        if (error)
            throw error

        VendorService.updateProfileWithOtp(userObj, req.body.username)
                .then(function (user) {
                    return res.status(200).send({result: Msg.OTP_SUCCESS, otp: OTP});
//            return res.send({ result: user.responseJSON() });
                }).catch(function (err) {
            return res.status(400).send({result: {error: err.message}})
        });

    });

};

exports.view = function (req, res, next) {
    console.log("innnnnnnnnnnnnnn")
    VendorService.getProfile(req.params.user_id).then(function (data) {
        if (data) {
            return res.send({result: data.responseJSON()})
        } else {
            return res.status(400).send({result: {error: Msg.USER_NOT_EXISTS}})
        }

    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.logout = function (req, res, next) {
    VendorService.logout(req.params.user_id, req.headers[Msg.HEADER_OS_TYPE].toLowerCase(), req.body.deviceToken)
            .then(function (user) {
                redisClient.del(req.headers[Msg.HEADER_AUTH_TOKEN], function (err, status) {
                    if (err) {
                        throw err;
                    }
                    if (status === 0) {
                        throw new Error(errorMsg.REDIS_TOKEN_ABSENT);
                    }
                    return res.send({result: Msg.LOGGED_OUT});
                })
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.activate = function (req, res, next) {
    VendorService.profileActivate(req.params.user_id, req.query).then(function (user) {
        if (user) {
            return res.send({result: user.responseJSON()})
        } else {
            return res.status(400).send({result: {error: Msg.USER_NOT_EXISTS}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.deactivate = function (req, res, next) {
    UserService.profileDeactivate(req.params.user_id).then(function (user) {
        if (user) {
            return res.send({result: user.responseJSON()})
        } else {
            return res.status(400).send({result: {error: Msg.USER_NOT_EXISTS}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.resetPassword = function (req, res, next) {
    VendorService.setPassword(req.body, req.headers[Msg.HEADER_OS_TYPE].toLowerCase()).then(function (user) {
        if (user) {
            return res.send({result: user.responseJSON()})
        } else {
            return res.status(400).send({result: {error: Msg.USER_NOT_EXISTS}})
        }
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.all = function (req, res, next) {
    VendorService.all(req.query).then(function (users) {
        return res.send({result: users})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.myOrders = function (req, res, next) {
    UserService.myOrders(req.params.user_id, req.query).then(function (orders) {
        return res.send({result: orders})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.myStores = function (req, res, next) {
    UserService.myStores(req.query, req.params.user_id)
            .then(function (data) {
                if (data) {
                    return res.send({result: data})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.address = function (req, res, next) {
    UserService.address(req.params.user_id)
            .then(function (data) {
                if (data) {
                    return res.send({result: data.addresses})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
exports.getIndividualaddress = function (req, res, next) {
    UserService.getIndividualaddress(req.params.user_id, req.params.address_id)
            .then(function (data) {
                if (data) {
                    return res.send({result: data.addresses})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.addNewaddress = function (req, res, next) {
    var userObj = {}
    userObj._id = shortid.generate()
    userObj.line1 = req.body.line1
    userObj.line2 = req.body.line2
    userObj.city = req.body.city
    userObj.country = req.body.country
    userObj.state = req.body.state
    userObj.zipcode = req.body.zipcode,
            userObj.addressType = req.body.addressType,
//    var userObj = req.body
            UserService.addNewAddress(req.body, req.params.user_id)
            .then(function (data) {
                if (data) {
                    return res.send({result: data.addresses})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
exports.deleteAdd = function (req, res, next) {
    console.log("delete", req.body.address_id, req.params.user_id)
    UserService.deleteAddress(req.body.address_id, req.params.user_id)
            .then(function (data) {
                if (data) {
                    return res.send({result: data.addresses})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.updateAddressDetails = function (req, res, next) {

    var addressObj = {}

    if (req.body.line1) {
        addressObj["addresses.$.line1"] = req.body.line1
    }

    if (req.body.line2) {
        addressObj["addresses.$.line2"] = req.body.line2
    }

    if (req.body.city) {
        addressObj["addresses.$.city"] = req.body.city
    }

    if (req.body.country) {
        addressObj["addresses.$.country"] = req.body.country
    }

    if (req.body.state) {
        addressObj["addresses.$.state"] = req.body.state
    }
    if (req.body.zipcode) {
        addressObj["addresses.$.zipcode"] = req.body.zipcode
    }
    if (req.body.addressType) {
        addressObj["addresses.$.addressType"] = req.body.addressType
    }
    console.log(addressObj, "addressObjaddressObj")

    UserService.updateAddressDetails(addressObj, req.params.user_id, req.params.address_id).then(function (product) {
        return res.send({result: product})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
const fs = require('fs');
exports.getQRCode = function (req, res, next) {
    UserService.getQRCode(req.params.user_id).then(function (code) {
//        console.lo
        const qrImage = "/public/qr_images/" + code.qrCodeImage
        return res.send({result: qrImage})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
}
//exports.getQRCode = function (req, res, next) {    
//    UserService.getQRCode(req.params.user_id).then(function (code) {
//        var qr_png = qr.imageSync(code.qrCode, {type: 'png'})
//        let qr_code_file_name = new Date().getTime() + '.png';
//        fs.writeFileSync('./public/qr_images/' + code.qrCodeImage, qr_png, (err) => {
//        if (err) {
//            console.log(err);
//        }
//    })
//    const qrImage =  "/public/qr_images/" + code.qrCodeImage
//        return res.send({result:qrImage})
//    }).catch(function (err) {
//        return res.status(400).send({result: {error: err.message}})
//    })
//}
var Jimp = require("jimp");
exports.qrCodeVerification = function (req, res, next) {
    UserService.qrCodeVerification(req.params.user_id).then(function (users) {
        return res.send({result: users})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
}

exports.prefferedLanguages = function (req, res, next) {
    console.log("innnnnnnnnnn, langgggg")
    var langauages = [
        "English",
        "Hindi",
        "Telugu",
        "Tamil",
        "Kerala",
        "Kannad"
    ];
//    UserService.qrCodeVerification(req.params.user_id).then(function (users) {
    return res.send({result: langauages})
//    }).catch(function (err) {
//        return res.status(400).send({result: {error: err.message}})
//    })
}
exports.addReview = function (req, res, next) {
    console.log("innnnnnnnnnn, review")
    var userReview = req.body;
    UserService.review(userReview, req.params.user_id).then(function (reviews) {
        return res.send({result: reviews})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
}
