/** External modules **/
const routes = require('express').Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');
const uploadService = require('../api/services/upload.service');
const userController = require('../api/controllers/user.controller');
const productCategoryController = require('../api/controllers/product-category.controller');
const productSubCategoryController = require('../api/controllers/product-subcategory.controller');
const productController = require('../api/controllers/product.controller');
const IndustryController = require('../api/controllers/industry.controller');
const FavouritesController = require('../api/controllers/favourites.controller');
const FavouriteStoresController = require('../api/controllers/favourite-stores.controller');
const PlanController = require('../api/controllers/plan.controller');
const CallController = require('../api/controllers/calls.controller');
const BlogCategoryController = require('../api/controllers/blog-category.controller');
const OrderController = require('../api/controllers/order.controller');
const CouponController = require('../api/controllers/coupon.controller');
const PrescriptionController = require('../api/controllers/prescription.controller');
const CityController = require('../api/controllers/city.controller');
const NeedHelpController = require('../api/controllers/need-help.controller');
const StoreProductsController = require('../api/controllers/store-products.controller');
const PrivacyController = require('../api/controllers/privacy.controller');
const BrandController = require('../api/controllers/brands.controller');
const VendorController = require('../api/controllers/vendor.controller');
const TypeController = require('../api/controllers/option-type.controller');

//default response
routes.get('/', (req, res) => {
  res.send("Welcome to Nxt-Order API. V1.0");
});

routes.get('/preffered-languages', userController.prefferedLanguages);

routes.post('/bulkupload-products', validator.validateHeaders, authorization.requiresLogin, uploadService.bulkupload.single('products'), productController.bulkupload);
routes.get('/product-categories', validator.validateHeaders,  productCategoryController.all);
//routes.get('/product-categories', validator.validateHeaders,  productCategoryController.all);
routes.get('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, productCategoryController.view);
routes.post('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, productCategoryController.update);
routes.delete('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, productCategoryController.delete);
routes.put('/product-categories', validator.validateHeaders, authorization.requiresLogin,uploadService.bulkupload.array('image'), productCategoryController.register);
//routes.get('/product-categories-industrywise/:industry_id', validator.validateHeaders, authorization.requiresLogin, productCategoryController.industryWisecategories);
//routes.get('/product-categories-industrywise/:industry_id', productCategoryController.industryWisecategories);
routes.get('/product-categories-industrywise/:industry_id', productCategoryController.industryWisecategories);
 
// Product Sub Categories

routes.get('/product-subcategories', validator.validateHeaders, productSubCategoryController.all);
routes.get('/product-subcategories/:subcategory_id', validator.validateHeaders, authorization.requiresLogin, productSubCategoryController.view);
routes.post('/product-subcategories/:subcategory_id', validator.validateHeaders, authorization.requiresLogin, productSubCategoryController.update);
routes.delete('/product-subcategories/:category_id', validator.validateHeaders, authorization.requiresLogin, productSubCategoryController.delete);
routes.post('/product-subcategories', validator.validateHeaders,  productSubCategoryController.register);
//routes.post('/product-subcategories', validator.validateHeaders, authorization.requiresLogin, productSubCategoryController.register);
routes.get('/product-subcategoriesbyid/:category_id', validator.validateHeaders, authorization.requiresLogin, productSubCategoryController.getCategoryWise);

//
routes.post('/user/login', validator.validateHeaders, userController.createToken);
routes.post('/user/login/otp', validator.validateHeaders, userController.createTokenWithOTP);
routes.post('/user/resetPassword', validator.validateHeaders, userController.resetPassword);
routes.post('/user/otp', validator.validateHeaders, userController.generateOTP);
routes.post('/user/verify-otp',validator.validateHeaders, userController.otpVerification)

routes.get('/trending-products1', OrderController.trendingProducts1);
routes.get('/trending-products', OrderController.trendingProducts);
routes.get('/recommended-products', OrderController.recommendedProducts);
routes.get('/new-arrivals', StoreProductsController.newArrivals);
//routes.get('/products', validator.validateHeaders, productController.industryWise);
routes.get('/products', StoreProductsController.industryWise);
routes.get('/top-brands', OrderController.topBrands);
routes.get('/simillar-products/industry/:industry_id/category/:category_id/brand/:brandName', StoreProductsController.simillarProducts);
//routes.get('/simillar-products/industry/:industry_id/category/:category_id/brand/:brandName', productController.simillarProducts);

routes.get('/prescriptions',  PrescriptionController.all);
routes.get('/prescriptions/:prescription_id',PrescriptionController.view);
routes.post('/prescriptions/:prescription_id', uploadService.bulkupload.array('images'), PrescriptionController.update);
routes.delete('/prescriptions/:prescription_id',PrescriptionController.delete);
routes.post('/prescriptions', uploadService.bulkupload.array('images'), PrescriptionController.register);
//routes.get('/prescriptions/:prescription_id',PrescriptionController.getCategoryWise);

routes.get('/city', validator.validateHeaders,  CityController.all);
routes.get('/city/:city_id', validator.validateHeaders, CityController.view);
//routes.get('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, CityController.view);
routes.post('/city/:city_id', validator.validateHeaders, CityController.update);
//routes.post('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, CityController.update);
routes.delete('/city/:city_id', validator.validateHeaders, CityController.delete);
//routes.delete('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, CityController.delete);
//routes.put('/product-categories', validator.validateHeaders, authorization.requiresLogin, CityController.register);
routes.put('/city', validator.validateHeaders, CityController.register);

// Need help

routes.get('/need-help', validator.validateHeaders,  NeedHelpController.all);
routes.get('/need-help/:help_id', validator.validateHeaders, NeedHelpController.view);
routes.get('/topic-issues/:help_id', validator.validateHeaders, NeedHelpController.topicissues);
routes.post('/need-help/:help_id', validator.validateHeaders, NeedHelpController.update);
//routes.post('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, CityController.update);
//routes.delete('/city/:city_id', validator.validateHeaders, NeedHelpController.delete);
//routes.delete('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, CityController.delete);
//routes.put('/product-categories', validator.validateHeaders, authorization.requiresLogin, CityController.register);
routes.put('/need-help', validator.validateHeaders, NeedHelpController.register);

//Privacy Policies
routes.put('/privacy', validator.validateHeaders, PrivacyController.create);
routes.get('/privacy/:privacy_id', validator.validateHeaders, PrivacyController.view);
routes.post('/privacy/:privacy_id', validator.validateHeaders, PrivacyController.update);
routes.get('/privacy', validator.validateHeaders,  PrivacyController.all);
routes.delete('/privacy/:privacy_id', validator.validateHeaders,  PrivacyController.delete);


//app.get('/', validator.validateHeaders, authorization.requiresLogin, userController.all);
//routes.post('/vendor-profile/:user_id', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('profilePicture'), VendorController.update);
//routes.post('/vendor-profile/:user_id', validator.validateHeaders, uploadService.upload.single('profilePicture'), VendorController.update);
//app.get('/:user_id', validator.validateHeaders, authorization.requiresLogin, VendorController.view);
//routes.get('/:vendor_id', validator.validateHeaders, VendorController.view);
//app.get('/:user_id/activate', authorization.requiresLogin, userController.activate);
////app.get('/:user_id/deactivate', authorization.requiresLogin, userController.deactivate);
//app.get('/:user_id/logout', authorization.requiresLogin, userController.logout);
//app.get('/:user_id/orders', validator.validateHeaders, authorization.requiresLogin, userController.myOrders);
//app.get('/:user_id/stores', validator.validateHeaders, authorization.requiresLogin, userController.myStores);
routes.put('/vendor', validator.validateHeaders, VendorController.register);


//// Product rating
//
//
//routes.get('/product-rating', validator.validateHeaders,  NeedHelpController.all);
//routes.get('/need-help/:help_id', validator.validateHeaders, NeedHelpController.view);
//routes.get('/topic-issues/:help_id', validator.validateHeaders, NeedHelpController.topicissues);
//routes.post('/need-help/:help_id', validator.validateHeaders, NeedHelpController.update);
////routes.post('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, CityController.update);
////routes.delete('/city/:city_id', validator.validateHeaders, NeedHelpController.delete);
////routes.delete('/product-categories/:category_id', validator.validateHeaders, authorization.requiresLogin, CityController.delete);
////routes.put('/product-categories', validator.validateHeaders, authorization.requiresLogin, CityController.register);
//routes.put('/need-help', validator.validateHeaders, NeedHelpController.register);


routes.use('/users', require('./user'));

routes.use('/industry', require('./industry'));

routes.use('/brands', require('./brands'));

routes.use('/product-rating', require('./product-rating'));

//routes.use('/stores', require('./store'));
routes.use('/stores', require('./store-products'));

routes.use('/products', require('./master-product'));

routes.use('/payments', require('./payment'));

routes.use('/cart', require('./cart'));

routes.use('/permissions', require('./permission'));

routes.use('/roles', require('./role'));


routes.use('/favourites', require('./favourites'));

routes.use('/favouritestores', require('./favourite-stores'));

routes.use('/plans', require('./plan'));

routes.use('/call', require('./calls'));

routes.use('/blog-category', require('./blog-category'));

routes.use('/blogs', require('./blogs'));

routes.use('/coupons', require('./coupons'));

routes.use('/reminders', require('./reminders'));

routes.use('/medicine', require('./medicine-search'));

routes.use('/options', require('./options'));

//routes.use('/privacy', require('./privacy'));

module.exports = routes;
