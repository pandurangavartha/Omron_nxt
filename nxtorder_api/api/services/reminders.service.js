const Promise = require('bluebird');
const reminder = require('../models/reminder.model');
const Msg = require('../../config/strings');
const _ = require('lodash');

exports.create = async objReminder => {
    try {
        return await reminder.create(objReminder);
    }
    catch (err) {
        if (err.name === 'ValidatorError') {
            let error = new Error(err.message);
            error.status = 400;
            return error;
        }
    }
}

exports.list = async userId => {
    try {
        return await reminder.find({ user_id: userId });
    }
    catch (err) {
        if (err.name === 'ValidatorError') {
            let error = new Error(err.message);
            error.status = 400;
            return error;
        }
    }
}

exports.update = async ( objReminder, reminderId ) => {
    let id = { _id: reminderId }; 
    try {
        return await reminder.findOneAndUpdate(id, objReminder);
    }
    catch (err) {
        if (err.name === 'ValidatorError') {
            let error = new Error(err.message);
            error.status = 400;
            return error;
        }
    }
}

exports.get = async reminderId => {
    let id = { _id: reminderId }; 
    try {
        return await reminder.findById(id);
    }
    catch (err) {
        if (err.name === 'ValidatorError') {
            let error = new Error(err.message);
            error.status = 400;
            return error;
        }
    }
}

exports.remove = async reminderId => {
    let id = { _id: reminderId }
    try {
        return await reminder.findOneAndDelete(id);
    }
    catch (err) {
        if (err.name === 'ValidatorError') {
            let error = new Error(err.message);
            error.status = 400;
            return error;
        }
    }
}
