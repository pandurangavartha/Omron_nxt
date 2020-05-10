const Permission = require('../models/permission.model')
const User = require('../models/user.model')
const Role = require('../models/role.model')

const shortIdMid = "(\/[A-Za-z0-9_-]+\/)"
const shortIdEnd = "(\/[A-Za-z0-9_-]+)$"

exports.createDefaultRecords = function () {
    var permissions = [
        //check for originalUrl in the req object for resourcePath
        { resourcePath: '^\/(products)' + shortIdMid + '(offers)' + shortIdEnd, method: 'DELETE', resourceName: 'Remove Product Offer' },
        { resourcePath: '^\/(products)' + shortIdMid + '(offers)$', method: 'PUT', resourceName: 'Add Product Offer' },
        { resourcePath: '^\/(products)' + shortIdMid + '(offers)$', method: 'GET', resourceName: 'View Product Offers' },
        { resourcePath: '^\/(products)' + shortIdMid + '(offers)' + shortIdEnd, method: 'POST', resourceName: 'Update Product Offers' },
        { resourcePath: '^\/(products)' + shortIdMid + '(deactivate)$', method: 'GET', resourceName: 'Deactivate Product' },
        { resourcePath: '^\/(products)' + shortIdMid + '(activate)$', method: 'GET', resourceName: 'Activate Product' },
        { resourcePath: '^\/(products)' + shortIdMid + '(vendors)$', method: 'PUT', resourceName: 'Add Vendors to the Product' },
        { resourcePath: '^\/(products)' + shortIdMid + '(vendors)' + shortIdEnd, method: 'DELETE', resourceName: 'Remove Vendors to the Product' },
        { resourcePath: '^\/(stores)' + shortIdMid + '(products)$', method: 'PUT', resourceName: 'Create Product' },
        { resourcePath: '^\/(products)' + shortIdMid + '(bulk-pricings)$', method: 'PUT', resourceName: 'Add Bulk Pricings to the Product' },
        { resourcePath: '^\/(products)' + shortIdMid + '(bulk-pricings)' + shortIdEnd, method: 'POST', resourceName: 'Update Bulk Pricings to the Product' },
        { resourcePath: '^\/(products)' + shortIdMid + '(bulk-pricings)' + shortIdEnd, method: 'DELETE', resourceName: 'Delete Bulk Pricings to the Product' },
        { resourcePath: '^\/(product-categories)$', method: 'PUT', resourceName: 'Create Product Category' },
        { resourcePath: '^\/(product-categories)' + shortIdEnd, method: 'DELETE', resourceName: 'Delete Product Category' },
        { resourcePath: '^\/(product-categories)' + shortIdEnd, method: 'POST', resourceName: 'Update Product Category' },
        { resourcePath: '^\/(users)' + shortIdMid + '(activate)$', method: 'GET', resourceName: 'Activate User' },
        { resourcePath: '^\/(users)' + shortIdMid + '(deactivate)$', method: 'GET', resourceName: 'Deactivate User' },
        { resourcePath: '^\/(stores)' + shortIdMid + '(employees)$', method: 'PUT', resourceName: 'Add an Employee' },
        { resourcePath: '^\/(stores)' + shortIdMid + '(employees)' + shortIdEnd, method: 'DELETE', resourceName: 'Remove an Employee' },
        { resourcePath: '^\/(stores)' + shortIdMid + '(deactivate)$', method: 'GET', resourceName: 'Deactivate Store' },
        { resourcePath: '^\/(stores)' + shortIdMid + '(activate)$', method: 'GET', resourceName: 'Activate Store' },
        { resourcePath: '^\/(stores)' + shortIdMid + '(settings)$', method: 'POST', resourceName: 'Update Store Settings' },
        { resourcePath: '^\/(stores)' + shortIdEnd, method: 'GET', resourceName: 'View Store' },
        { resourcePath: '^\/(stores)', method: 'PUT', resourceName: 'Create Store' },
        { resourcePath: '^\/(stores)' + shortIdEnd, method: 'POST', resourceName: 'Update Store' }

    ];

    Permission.insertMany(permissions)
        .then(function (data) {
            console.log('Permissions created successfully.');
            var roleObj = {
                "roleName": "Nxt-Order Admin",
                "permissions": data
            }
            return Role.create(roleObj)
        }).catch(function (err) {
            if (err && err.message.includes('duplicate key')) {
                return console.log('Permissions creations ignored becuase already created')
            }
            return console.log('Permissions creation failed.');
        });

    var admin = { username: 'Administrator', firstName: 'Nxt-Order', lastName: 'Admin', password: 'Nxt@rder', status: 'Active', mobile:"9705961068",roles: ["NxtOrderAdmin"] }

    User.create(admin).then(function (data) {
        return console.log('Administrator created successfully.');
    }).catch(function (err) {
        if (err && err.message.includes('duplicate key')) {
            return console.log('Administrator creation ignored becuase already created')
        }
        return console.log('Administrator creation failed.');
    });
};