const NeedHelpService = require('../services/need-help.service');
const shortid = require('shortid');
const Msg = require('../../config/strings');
const AuthService = require('../services/auth.service');
const Request = require("request");
const qr = require('qr-image');
exports.register = function (req, res, next) {
    var helpObj = req.body;
    console.log(helpObj, "helpObjhelpObj")
    if(helpObj.topicissues) {
        helpObj .topicissues = helpObj.topicissues;
    }
    if(helpObj.industry_id) {
        helpObj["industry._id"] = helpObj.industry_id 
    }
    NeedHelpService.register(helpObj).then(function (help) {
//        delete user.responseJSON().qrCode;
//        delete user.qrCodeImage;
        return res.json({result:help });
    }).catch(function (err) {
        console.log("in eroor", err)
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.update = function (req, res, next) {
    var helpObj = req.body;
    NeedHelpService.update(helpObj, req.params.help_id)
            .then(function (help) {
                return res.send({result: help});
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};

exports.view = function (req, res, next) {
    console.log("innnnnnnnnnnnnnn")
    NeedHelpService.view(req.params.help_id).then(function (data) {
        if (data) {
            return res.send({result: data.responseJSON()})
        } else {
            return res.status(400).send({result: {error: Msg.USER_NOT_EXISTS}})
        }

    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};


exports.all = function (req, res, next) {
    NeedHelpService.all(req.query).then(function (users) {
        return res.send({result: users})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};


exports.topicissues = function (req, res, next) {
    NeedHelpService.topicissues(req.params.help_id)
            .then(function (data) {
                if (data) {
                    return res.send({result: data.topicissues})
                } else {
                    return res.status(204).send({result: {error: Msg.NO_CONTENT}})
                }
            }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    });
};
exports.getIndividualaddress = function (req, res, next) {
    NeedHelpService.getIndividualaddress(req.params.user_id, req.params.address_id)
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
            NeedHelpService.addNewAddress(req.body, req.params.user_id)
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
    NeedHelpService.deleteAddress(req.body.address_id, req.params.user_id)
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

    NeedHelpService.updateAddressDetails(addressObj, req.params.user_id, req.params.address_id).then(function (product) {
        return res.send({result: product})
    }).catch(function (err) {
        return res.status(400).send({result: {error: err.message}})
    })
};
