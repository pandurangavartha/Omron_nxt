/** External modules **/
const express = require('express');
const app = express.Router();

const validator = require('../middlewares/headers-validation');
const authorization = require('../middlewares/authorization');

const uploadService = require('../api/services/upload.service');
const storeController = require('../api/controllers/store.controller');
const offerController = require('../api/controllers/offer.controller');
const bulkPricingController = require('../api/controllers/product-lot-pricing.controller');
const expenseController = require('../api/controllers/expense.controller');
const orderController = require('../api/controllers/order.controller');
const StoreproductController = require('../api/controllers/store-products.controller');
const productController = require('../api/controllers/product.controller');
const procurementController = require('../api/controllers/procurement.controller');
const productInventoryController = require('../api/controllers/product-inventory.controller');
const ReportController = require('../api/controllers/report.controller');
// stores
app.delete('/:store_id/employees/:employee_id', validator.validateHeaders, authorization.requiresLogin, storeController.removeEmployees);
app.put('/:store_id/employees/', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('profilePicture'), storeController.addEmployee);
app.get('/:store_id/employees', validator.validateHeaders, authorization.requiresLogin, storeController.viewEmployees);
app.get('/:store_id/deactivate', validator.validateHeaders, authorization.requiresLogin, storeController.deactivate);
app.get('/:store_id/activate', validator.validateHeaders, authorization.requiresLogin, storeController.activate);
app.get('/:store_id', validator.validateHeaders, storeController.view);
app.get('/:store_id/categories', validator.validateHeaders, storeController.getCategories);
app.get('/:category_id/stores', validator.validateHeaders, storeController.getCategorywiseStores);
//app.get('/:store_id', validator.validateHeaders, authorization.requiresLogin, storeController.view);
//app.get('/', validator.validateHeaders, authorization.requiresLogin, storeController.getAll);
app.get('/', storeController.getAll);
//app.get('/trending_products', validator.validateHeaders, orderController.trendingProducts);
app.post('/:store_id', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('logo'), storeController.update);
//app.put('/', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('logo'), storeController.register);
app.put('/', uploadService.upload.single('logo'), storeController.register);
app.put('/brands', uploadService.upload.single('logo'), storeController.createBrand);
//app.post('/stores/:industry_id', validator.validateHeaders, authorization.requiresLogin, storeController.getAllIndustrywise);
app.get('/:store_id/subcategories/:storecategory_id', storeController.getSubCategories);

// expenses
app.get('/:store_id/expenses', validator.validateHeaders, authorization.requiresLogin, expenseController.all);
app.get('/:store_id/expenses/:expense_id', validator.validateHeaders, authorization.requiresLogin, expenseController.view);
app.post('/:store_id/expenses/:expense_id', validator.validateHeaders, authorization.requiresLogin, expenseController.update);
app.delete('/:store_id/expenses/:expense_id', validator.validateHeaders, authorization.requiresLogin, expenseController.delete);
app.put('/:store_id/expenses', validator.validateHeaders, authorization.requiresLogin, expenseController.register);

//orders
app.get('/:store_id/orders', validator.validateHeaders, authorization.requiresLogin, orderController.all);
app.get('/:store_id/orders/:order_id', validator.validateHeaders, authorization.requiresLogin, orderController.view);
app.post('/:store_id/orders/:order_id', validator.validateHeaders, authorization.requiresLogin, orderController.update);
app.delete('/:store_id/orders/:order_id', validator.validateHeaders, authorization.requiresLogin, orderController.delete);
app.delete('/:store_id/orders/:order_id/product', validator.validateHeaders, authorization.requiresLogin, orderController.removeProduct);
app.put('/:store_id/orders/:order_id/product', validator.validateHeaders, authorization.requiresLogin, orderController.addProduct);
app.put('/:store_id/orders', validator.validateHeaders, authorization.requiresLogin, orderController.register);
app.get('/:user_id/allorders', validator.validateHeaders, authorization.requiresLogin, orderController.getOrdersWithuserId);


// procurements management

app.get('/:store_id/procurements', validator.validateHeaders, authorization.requiresLogin, procurementController.all);
app.get('/:store_id/procurements/:procurement_id', validator.validateHeaders, authorization.requiresLogin, procurementController.view);
app.post('/:store_id/procurements/:procurement_id', validator.validateHeaders, authorization.requiresLogin, procurementController.update);
app.put('/:store_id/procurements', validator.validateHeaders, authorization.requiresLogin, procurementController.register);

// inventory management
app.get('/:store_id/inventory', validator.validateHeaders, authorization.requiresLogin, productInventoryController.all);
app.get('/:store_id/inventory/products', validator.validateHeaders, authorization.requiresLogin, productInventoryController.inventoryProducts);
app.get('/:store_id/inventory/:inventory_id', validator.validateHeaders, authorization.requiresLogin, productInventoryController.view);
app.post('/:store_id/inventory/:inventory_id', validator.validateHeaders, authorization.requiresLogin, productInventoryController.update);
app.delete('/:store_id/inventory/:inventory_id', validator.validateHeaders, authorization.requiresLogin, productInventoryController.delete);
app.put('/:store_id/inventory', validator.validateHeaders, authorization.requiresLogin, productInventoryController.register);

app.get('/:store_id/products/:product_id/inventory', validator.validateHeaders, authorization.requiresLogin, productController.productInventory);
// vendors management
app.get('/:store_id/products/vendors', validator.validateHeaders, authorization.requiresLogin, productController.vendorsProducts);
app.get('/:store_id/products/:product_id/vendors/search', validator.validateHeaders, authorization.requiresLogin, productController.searchVendors);
app.get('/:store_id/products/:product_id/vendors', validator.validateHeaders, authorization.requiresLogin, productController.vendors);
app.put('/:store_id/products/:product_id/vendors', validator.validateHeaders, authorization.requiresLogin, productController.addVendors);
app.delete('/:store_id/products/:product_id/vendors/:vendor_id', validator.validateHeaders, authorization.requiresLogin, productController.removeVendors);

// variants management
app.put('/:store_id/products/:product_id/category/:category_id/subcategory/:subcategory_id/variants', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.array('images'), StoreproductController.addVariant);
app.post('/:store_id/products/:product_id/variants/:variant_id', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.array('images'), StoreproductController.updateVariantDetails);
app.delete('/:store_id/products/:product_id/variants/:variant_id', validator.validateHeaders, authorization.requiresLogin, StoreproductController.removeVariant);

// bulk-pricings for products management

app.get('/:store_id/products/:product_id/bulk-pricings', validator.validateHeaders, authorization.requiresLogin, bulkPricingController.getAllBulkPricings);
app.get('/:store_id/products/:product_id/bulk-pricings/:bulk_pricing_id', validator.validateHeaders, authorization.requiresLogin, bulkPricingController.view);
app.post('/:store_id/products/:product_id/bulk-pricings/:bulk_pricing_id', validator.validateHeaders, authorization.requiresLogin, bulkPricingController.update);
app.put('/:store_id/products/:product_id/bulk-pricings', validator.validateHeaders, authorization.requiresLogin, bulkPricingController.register);
app.delete('/:store_id/products/:product_id/bulk-pricings/:bulk_pricing_id', validator.validateHeaders, authorization.requiresLogin, bulkPricingController.delete);

// offers management

//app.get('/:store_id/products/offers', offerController.products);
app.get('/products/offers', offerController.products);
app.get('/:store_id/products/:product_id/offers',  offerController.all);
//app.get('/:store_id/offers', validator.validateHeaders, authorization.requiresLogin, offerController.all);
app.get('/:store_id/products/:product_id/offers/:offer_id', validator.validateHeaders, authorization.requiresLogin, offerController.view);
app.post('/:store_id/products/:product_id/offers/:offer_id', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('bannerImage'), offerController.update);
app.delete('/:store_id/products/:product_id/offers/:offer_id', validator.validateHeaders, authorization.requiresLogin, offerController.delete);
//app.put('/:store_id/industry/:industry_id/products/:product_id/offers', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('bannerImage'), offerController.register);
app.put('/:store_id/industry/:industry_id/products/offers', validator.validateHeaders, authorization.requiresLogin,  uploadService.upload.single('bannerImage'), offerController.register);
//app.put('/:store_id/products/:product_id/offers', validator.validateHeaders,  uploadService.upload.single('bannerImage'), offerController.register);

// products management add
app.get('/:store_id/products/:product_id/deactivate', validator.validateHeaders, authorization.requiresLogin, StoreproductController.deactivate);
app.get('/:store_id/products/:product_id/activate', validator.validateHeaders, authorization.requiresLogin, StoreproductController.activate);
app.get('/:store_id/products/:product_id', StoreproductController.view);
//app.get('/:store_id/products/:product_id', validator.validateHeaders, authorization.requiresLogin, productController.view);
app.post('/:store_id/products/:product_id', validator.validateHeaders, authorization.requiresLogin, uploadService.upload.single('logo'), productController.update);
app.delete('/:store_id/products/:product_id', validator.validateHeaders, authorization.requiresLogin, StoreproductController.delete);
app.get('/:store_id/subcategory/:subCategory_id/products', validator.validateHeaders, authorization.requiresLogin, StoreproductController.products);
//app.put('/:store_id/products', validator.validateHeaders, authorization.requiresLogin,uploadService.upload.single('logo'),  productController.register);
app.put('/:store_id/products', validator.validateHeaders, authorization.requiresLogin, StoreproductController.register);
//app.get('/:store_id/products', validator.validateHeaders, authorization.requiresLogin, productController.all);
app.get('/:store_id/products', StoreproductController.all);
// industrywise products
//app.get('/industry/:industry_id/industryproducts', validator.validateHeaders, authorization.requiresLogin, productController.industryWise);
//app.get('/industry/:industry_id/products', validator.validateHeaders, authorization.requiresLogin, productController.industryWise);
//app.get('/products?industry_id', validator.validateHeaders, productController.industryWise);
app.get('/industry/:industry_id/category/:category_id/subcategory/:subcategory_id/products', validator.validateHeaders, authorization.requiresLogin, productController.singleSubcategory);
//app.put('/industry/:industry_id/category/:category_id/subcategory/:subcategory_id/products', validator.validateHeaders, authorization.requiresLogin, productController.singleSubcategory);

app.get('/:store_id/reports/sales', validator.validateHeaders, authorization.requiresLogin, ReportController.sales);
app.get('/:store_id/reports/taxcollected', validator.validateHeaders, authorization.requiresLogin, ReportController.taxCollected);

module.exports = app;
