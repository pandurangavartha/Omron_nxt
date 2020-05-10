const Msg = require('../../config/strings');
const reminderService = require('../services/reminders.service');

exports.add = (req, res, next) => {
    let requestBody = {
        product_name: req.body.product_name,
        user_id: req.body.user_id,
        reminder_category_name: req.body.category_text,
        reminder_category_time: req.body.category_time,
    }
    reminderService.create(requestBody).then( response => {
        let sendResponse = { 
            status: 'success', 
            message: 'Remainder created successfully', 
            data: response
        }
        return res.status(200).send( sendResponse );
    }).catch( err => {
        return res.status(400).send({ status: 'failed', data: { error: err.message } });
    })
}

exports.list = (req, res, next) => {
    reminderService.list( req.body.user_id).then( response => {
        let sendResponse = {
            status: 'success',
            data: response            
        }
        return res.status(200).send( sendResponse );
    }).catch(err => {
        return res.status(400).send({ status: 'failed', data: { error: err.message } });
    });
}

exports.update = (req, res, next) => {     
    let requestBody = {
        product_name: req.body.product_name,
        reminder_category_name: req.body.category_text,
        reminder_category_time: req.body.category_time,
    }

    reminderService.update(requestBody,req.params.reminderId).then( response => {
        let sendResponse = {
            status: 'success',
            data: response            
        }
        return res.status(200).send( sendResponse );
    }).catch(err => {
        return res.status(400).send({ status: 'failed', data: { error: err.message } });
    });
}

exports.getById = (req, res, next) => {
    reminderService.get(req.params.reminderId).then( response => {
        let sendResponse = {
            status: 'success',
            data: response            
        }
        return res.status(200).send( sendResponse );
    }).catch(err => {
        return res.status(400).send({ status: 'failed', data: { error: err.message } });
    });
}

exports.delete = (req, res, next) => {
    reminderService.remove(req.params.reminderId).then( response => {
        let sendResponse = {
            status: 'success',
            message: 'Remainder deleted successfully',        
        }
        return res.status(200).send( sendResponse );
    }).catch(err => {
        return res.status(400).send({ status: 'failed', data: { error: err.message } });
    });
}
