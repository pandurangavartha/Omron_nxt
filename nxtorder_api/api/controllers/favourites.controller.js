const FavouritesService = require('../services/favourites.service');

exports.register = function (req, res, next) {
    console.log(req.body, "req.bodyreq.body")
    var favouritesObj = req.body
     favouritesObj.user = req.user
//    console.log(favouritesObj, "cartObjcartObj00000000000")
    favouritesObj.product._id = favouritesObj.product._id
    console.log(favouritesObj, "favouritesObj")
    FavouritesService.create(favouritesObj).then(function (favourites) {
        console.log("innnnnnnnn")
//        return false;
        return res.send({ result: favourites });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};

//exports.update = function (req, res, next) {
//    var cart = req.body
//    CartService.update(cart, req.params.id)
//        .then(function (cart) {
//            return res.send({ result: cart });
//        })
//        .catch(function (err) {
//            return res.status(400).send({ result: { error: err.message } })
//        })
//};
//
//exports.view = function (req, res, next) {
//    CartService.view(req.params.id).then(function (data) {
//        return res.send({ result: data })
//    }).catch(function (err) {
//        return res.status(400).send({ result: { error: err.message } })
//    });
//};
//
exports.delete = function (req, res, next) {
    FavouritesService.delete(req.params.favourites_id).then(function (favourites) {
        return res.send({ result: favourites });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
exports.unFavourite = function (req, res, next) {
    console.log(req.params.product_id, "req.params.product_idreq.params.product_id")
    FavouritesService.unfavourite(req.params.product_id).then(function (favourites) {
        console.log(favourites, "favouritesfavourites")
        return res.send({ result: favourites });
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
};
//
//exports.all = function (req, res, next) {
//    CartService.getAll(req.params.store_id).then(function (data) {
//        return res.send({ result: data })
//    }).catch(function (err) {
//        return res.status(400).send({ result: { error: err.message } })
//    });
//}
//
exports.favouritesAllItems = function (req, res, next) {
//    console.log(req.query, "reqqqqq")
    FavouritesService.getItemsAll(req.params.user_id, req.query).then(function (data) {
        return res.send({ result: data })
    }).catch(function (err) {
        return res.status(400).send({ result: { error: err.message } })
    });
}