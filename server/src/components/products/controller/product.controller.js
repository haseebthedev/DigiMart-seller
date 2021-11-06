const Store = require("../../store/model/store.model");
const Product = require("../model/product.model");
const Review = require("../../review/model/review.model");
const mongoose = require("mongoose");
const Seller = require("../../users/seller/models/seller.model");

//updated
//FOR BUYER

const viewProductsOfSpecificCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const category = req.params.category;
    const products = await Product.getFilteredProducts(
      { category },
      page,
      limit
    );
    const maxPrice = await Product.find({
      isVisibilityEnabled: true,
      category,
    })
      .sort({ salePrice: -1 })
      .limit(1)
      .select({ salePrice: 1, discountPrice: 1 });

    const minPrice = await Product.find({
      isVisibilityEnabled: true,
      category,
    })
      .sort({ salePrice: 1 })
      .limit(1)
      .select({ salePrice: 1, discountPrice: 1 });

    res.status(200).json({
      message: `${category} products fetched successfully!`,
      data: {
        products: products,
        maxPrice,
        minPrice,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewProductsOfSpecificSubCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const subCategory = req.params.subCategory;
    const products = await Product.getFilteredProducts(
      { subCategory },
      page,
      limit
    );
    const maxPrice = await Product.find({
      isVisibilityEnabled: true,
      subCategory,
    })
      .sort({ salePrice: -1 })
      .limit(1)
      .select({ salePrice: 1, discountPrice: 1 });

    const minPrice = await Product.find({
      isVisibilityEnabled: true,
      subCategory,
    })
      .sort({ salePrice: 1 })
      .limit(1)
      .select({ salePrice: 1, discountPrice: 1 });

    res.status(200).json({
      message: `${subCategory} products fetched successfully!`,
      data: {
        products: products,
        maxPrice,
        minPrice,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewAllProductsInAllStoresForBuyer = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const products = await Product.getFilteredProducts({}, page, limit);
    const maxPrice = await Product.find({
      isVisibilityEnabled: true,
    })
      .sort({ salePrice: -1 })
      .limit(1)
      .select({ salePrice: 1, discountPrice: 1 });

    const minPrice = await Product.find({
      isVisibilityEnabled: true,
    })
      .sort({ salePrice: 1 })
      .limit(1)
      .select({ salePrice: 1, discountPrice: 1 });

    res.status(200).json({
      message: `All products fetched successfully!`,
      data: {
        products: products,
        maxPrice,
        minPrice,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewProductsOfStoreById = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const id = req.params.id;
    const products = await Product.find({
      storeID: id,
      isVisibilityEnabled: true,
    })
      .limit(limit)
      .skip(page * limit);
    if (!products) {
      throw new Error("Products not found!");
    }
    res.status(200).json({
      message: `Store products fetched successfully!`,
      data: {
        products: products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewProductsOnSale = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const filters = {
      isVisibilityEnabled: true,
      isOnSale: true
    }
    const products = await Product.getFilteredProducts(filters, page, limit);
    res.status(200).json({
      message: `Products On Sale fetched successfully!`,
      data: {
        products: products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewTopReviewedProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const filters = {
      isVisibilityEnabled: true,
    }
    const products = await Product.getFilteredProducts(filters, page, limit); 
    res.status(200).json({
      message: `Top Reviewed Products fetched successfully!`,
      data: {
        products: products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    let regexName = "";
    const name = req.query.name;
    const category = req.query.category;
    if (name) {
      regexName = { $regex: `.*${name}.*`, $options: "i" };
      // req.body.storeName = { $regex: `.*${name}.*` };
    }

    const filters = {
      isVisibilityEnabled: true,
      name: regexName,
      category,
    };
    if (!category) {
      delete filters.category;
    }
    const products = await Product.find(filters)
      .select({
        _id: 1,
        name: 1,
        category: 1,
        subCategory: 1,
        storeName: 1,
        storeID: 1,
        vendorCompanyName: 1,
        vendorCategory: 1,
      })
      .limit(limit)
      .skip(page * limit);
    // console.log(filters);
    if (!products) {
      throw new Error("Products not found!");
    }
    res.status(200).json({
      message: `Filtered products fetched successfully!`,
      data: {
        products: products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const mapFiltersToKeysOfDB = (filtersData) => {
  const data = filtersData;
  const minDate = data.startDate
    ? new Date(data.startDate).toISOString()
    : null;
  const maxDate = data.maxDate ? new Date(data.endDate).toISOString() : null;
  const tempMinPrice = data.minPrice;
  const tempMaxPrice = data.maxPrice;
  const isOnSale = data.isOnSale;
  const vendors = data.vendors;
  const subCategories = data.subCategories;
  const mainCategory = data.mainCategoryName;
  const name = data.name;

  const filters = {
    createdAt: {
      $gte: new Date(minDate ? minDate : Date.now()),
      $lte: new Date(maxDate ? maxDate : Date.now()),
    },
    salePrice: {
      $gte: tempMinPrice,
      $lte: tempMaxPrice,
    },
    isOnSale,
    vendorCompanyName: { $in: vendors },
    subCategory: { $in: subCategories },
    isVisibilityEnabled: true,
    category: mainCategory,
    name,
  };
  //now i will remove all values for filters that are not passed in req.body
  if (!isOnSale) {
    delete filters.isOnSale;
  }
  if (!minDate && !maxDate) {
    delete filters.createdAt;
  }
  if (!tempMinPrice && !tempMaxPrice) {
    delete filters.salePrice;
  }
  if (!vendors) {
    delete filters.vendorCompanyName;
  }
  if (!subCategories) {
    delete filters.subCategory;
  }
  if (!mainCategory) {
    delete filters.category;
  }
  if (!name) {
    delete filters.name;
  }
  return filters;
};

const filterProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const data = req.body;
    const subCategories = data.subCategories;
    const mainCategory = data.mainCategoryName;
    if (!data) {
      throw new Error("Please select filters to apply !");
    }
    const filters = mapFiltersToKeysOfDB(data);
    // console.log(filters)

    //for getting reviews of products and their rating
    const products = await Product.getFilteredProducts(filters, page, limit);
    const priceFilters = {
      category: mainCategory,
      subCategory: filters.subCategories ? subCategories[0] : null,
      isVisibilityEnabled: true,
    };
    if (!mainCategory) {
      delete priceFilters.category;
    }
    if (!filters.subCategories) {
      delete priceFilters.subCategory;
    }
    const maxPrice = await Product.find(priceFilters)
      .sort({ salePrice: -1 })
      .limit(1)
      .select({ salePrice: 1, discountPrice: 1 });

    const minPrice = await Product.find({
      isVisibilityEnabled: true,
    })
      .sort({ salePrice: 1 })
      .limit(1)
      .select({ salePrice: 1, discountPrice: 1 });
    res.status(200).json({
      message: `Filtered products fetched successfully!`,
      data: {
        products: products,
        maxPrice,
        minPrice,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getTopSellingProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const filters = mapFiltersToKeysOfDB(req.body);
    const products = await Product.getTopSellingProducts(filters, page, limit);
    res.status(200).json({
      message: `Top Selling products fetched successfully!`,
      data: {
        products: products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getProductDetailsForBuyer = async (req, res, next) => {
  try {
    const productID = mongoose.Types.ObjectId(req.params.id);
    const page = parseInt(req.query.page) || 0;
    const TopSellingProductLimit = parseInt(req.query.limitTopSelling) || 10;
    const RelatedProductsLimit = parseInt(req.query.limitRelatedProducts) || 30;
    const ProductLimit = parseInt(req.query.productLimit) || 1;
    let storeDetails,
      topSellingProductsOfStore,
      relatedProducts = null;
    const tempProduct = await Product.findById(productID).select({
      storeID: 1,
      category:1,
      subCategory:1
    });
    if(!tempProduct){
      throw new Error("Invalid product Id !")
    }
    const storeId = tempProduct.storeID;
    const product = await Product.getProductDetails(
      { _id: productID },
      page,
      ProductLimit
    );
    if (product.length > 0) {
      // const storeId = mongoose.Types.ObjectId(product.storeID);
      storeDetails = await Store.findById(storeId).select({
        name: 1,
        country: 1,
        city: 1,
        category: 1,
        biography: 1,
        buissnessAddress: 1,
        warehouseAddress: 1,
        sellerName: 1,
        type: 1,
        logo: 1,
        createdAt: 1,
        sellerId: 1
      });

      topSellingProductsOfStore = await Product.getTopSellingProducts(
        { storeID: storeId },
        page,
        TopSellingProductLimit
      );

      relatedProducts = await Product.getFilteredProducts(
        {
          subCategory: tempProduct.subCategory,
        },
        page,
        RelatedProductsLimit
      );

      //if no related products found of subcategory then fund of category
      if (relatedProducts.length < 1) {
        await Product.getFilteredProducts({
          category: tempProduct.category,
        },
        page,
        RelatedProductsLimit);
      }
    }
    

    res.status(200).json({
      message: `Product fetched successfully!`,
      data: {
        product:product.length > 0 ? product[0] : [],
        storeDetails,
        topSellingProductsOfStore,
        relatedProducts,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

//FOR SELLER

const addProductToMyStore = async (req, res, next) => {
  //FOR AUTHENTICATED VENDOR
  try {
    //check if product name added before in this store DB
    if (!req.store) {
      throw new Error("Please register your store to add Product.");
    }
    //check if store is not pending or blocked
    if (req.store.status == "Pending") {
      res.status(200).json({
        message: `Cannot add product! Your store's status is still pending for approval!`,
        data: {},
      });
    }
    if (req.store.status == "Blocked") {
      res.status(200).json({
        message: `Cannot add product! Your store is blocked temporarily for violating community rules!`,
        data: {},
      });
    }
    const isProductNamePresent = await Product.findOne({
      name: req.body.name,
      storeID: req.store._id,
    });
    if (isProductNamePresent) {
      throw new Error("Product with this name already added before.");
    }
    req.body["storeID"] = req.store._id;
    req.body["storeName"] = req.store.name;
    req.body["sellerID"] = req.user._id;
    req.body["sellerName"] = req.user.name;
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      message: `Your product has been added successfully!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);

    //check if product is the one selected from vendor's products
    if (req.body.vendorId) {
      //validations
      const allowedUpdated = ["stockAvailable", "salePrice"];
      const isValidOperation = updates.every((update) =>
        allowedUpdated.includes(update)
      );
      if (!isValidOperation || updates.length == 0) {
        throw new Error(
          "Invalid Keys! You can only update stock and sale price."
        );
      }
    }
    const productID = req.params.id;
    const storeID = req.store._id;
    const product = await Product.findOne({ _id: productID, storeID: storeID });
    updates.forEach((update) => {
      product[update] = req.body[update];
    });
    await product.save();
    res.status(200).json({
      message: `Your product has been updated successfully!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const storeID = req.store._id;
    const product = await Product.findOneAndDelete({
      _id: _id,
      storeID: storeID,
    });
    if (!product) {
      throw new Error("Product not found!");
    }
    res.status(200).json({
      message: `Your product has been deleted successfully!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const deleteAllProductsOfStore = async (req, res, next) => {
  try {
    let storeID = "";
    if (req.store) {
      storeID = req.store._id;
    } else {
      storeID = req.params.id;
    }
    const products = await Product.deleteMany({ storeID: storeID });
    if (!products) {
      throw new Error("Products not found!");
    }
    res.status(200).json({
      message: `All Products of store deleted successfully!`,
      data: {
        deletedProductsCount: products.deletedCount,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewMyStoreAllProducts = async (req, res, next) => {
  try {
    const storeID = req.store._id;
    const products = await Product.find({ storeID: storeID });
    if (!products) {
      throw new Error("Products not found!");
    }
    res.status(200).json({
      message: `Store products fetched successfully!`,
      data: {
        products: products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewStoreProductsSelectedByVendorsProducts = async (req, res, next) => {
  try {
    let storeID = "";
    if (req.store) {
      storeID = req.store._id;
    } else {
      storeID = req.params.id;
    }
    const products = await Product.find({
      storeID: storeID,
      vendorId: { $ne: null },
    });
    if (!products) {
      throw new Error("Products not found!");
    }
    res.status(200).json({
      message: `Vendor's products added in your store fetched successfully!`,
      data: {
        products: products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewStoreOwnProducts = async (req, res, next) => {
  try {
    let storeID = "";
    if (req.store) {
      storeID = req.store._id;
    } else {
      storeID = req.params.id;
    }
    const products = await Product.find({ storeID: storeID, vendorId: null });
    if (!products) {
      throw new Error("Products not found!");
    }
    res.status(200).json({
      message: `Store products fetched successfully!`,
      data: {
        products: products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewMyStoreProduct = async (req, res, next) => {
  try {
    const storeID = req.store._id;
    const productID = req.params.id;
    const product = await Product.findOne({ storeID: storeID, _id: productID });
    if (!product) {
      throw new Error("Product not found!");
    }
    res.status(200).json({
      message: `Product fetched successfully!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const countMyStoreProductsStock = async (req, res, next) => {
  try {
    const storeID = req.store._id;
    const products = await Product.aggregate([
      { $match: { stockAvailable: { $gte: 0 }, storeID: storeID } },
      { $group: { _id: null, totalStock: { $sum: "$stockAvailable" } } },
    ]);
    // if(!products){
    //     throw new Error('Products not found!')
    // }
    res.status(200).json({
      message: `Products stock count fetched successfully!`,
      data: {
        products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const countTotalExpenseOfProducts = async (req, res, next) => {
  try {
    const storeID = req.store._id;
    const products = await Product.aggregate([
      { $match: { purchasePrice: { $gte: 0 }, storeID: storeID } },
      {
        $group: {
          _id: null,
          purchasePrice: {
            $sum: { $multiply: ["$purchasePrice", "$stockAvailable"] },
          },
        },
      },
    ]);
    // if(!products){
    //     throw new Error('Products not found!')
    // }
    res.status(200).json({
      message: `Total Expense to buy products fetched successfully!`,
      data: {
        products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

//FOR ADMIN

const viewAllProductsInAllStores = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const products = await Product.find({})
      .limit(limit)
      .skip(page * limit);
    if (!products) {
      throw new Error("Products not found!");
    }
    res.status(200).json({
      message: `Products fetched successfully!`,
      data: {
        products: products,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewProductDetails = async (req, res, next) => {
  try {
    const productID = req.params.id;
    const product = await Product.findOne({ _id: productID });
    if (!product) {
      throw new Error("Product not found!");
    }
    res.status(200).json({
      message: `Product fetched successfully!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const viewProductsOfStore = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 30;
    const storeID = req.params.id;
    const product = await Product.find({ storeID: storeID })
      .limit(limit)
      .skip(page * limit);
    if (!product) {
      throw new Error("Store not found!");
    }
    res.status(200).json({
      message: `Store products fetched successfully!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const blockProduct = async (req, res, next) => {
  try {
    const productID = req.params.id;
    const product = await Product.findOne({ _id: productID });
    product["isVisibilityEnabled"] = false;
    await product.save();
    res.status(200).json({
      message: `blocked !`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const unblockProduct = async (req, res, next) => {
  try {
    const productID = req.params.id;
    const product = await Product.findOne({ _id: productID });
    product["isVisibilityEnabled"] = true;
    await product.save();
    res.status(200).json({
      message: `un blocked !`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getTotalNumberOfProducts = async (req, res, next) => {
  try {
    const totalNumberOfProducts = await Product.estimatedDocumentCount();
    return res.status(200).json({
      message: `Total number of products fetched successfully!.`,
      data: {
        totalNumber: totalNumberOfProducts,
      },
    });
  } catch (e) {
    e.status = 404;
    next(e);
  }
};

const editProductById = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    //validations
    // const allowedUpdated = ['name','category','description','manufactureDate','stockAvailable','price',
    // 'weight','discountPercentage','manufacturer','warranty','images','colors','isVisibilityEnabled']
    // const isValidOperation = updates.every((update) => allowedUpdated.includes(update))
    // if(!isValidOperation || updates.length == 0){
    //     throw new Error('Invalid Keys! Please enter valid keys.')
    // }
    const productID = await Product.findById(_id);
    const product = await Product.findOne({ _id: productID });

    updates.forEach((update) => {
      product[update] = req.body[update];
    });
    await product.save();
    res.status(200).json({
      message: `Product has been updated successfully!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const product = await Product.findOneAndDelete({ _id: _id });
    if (!product) {
      throw new Error("Product not found!");
    }
    res.status(200).json({
      message: `Product has been deleted successfully!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const addProductByStoreId = async (req, res, next) => {
  try {
    const storeId = req.params.id;
    const store = await Store.findOne({ _id: storeId });
    //check if product name added before in this store DB
    if (!store) {
      throw new Error("Please register store to add Product.");
    }
    //check if store is not pending or blocked
    if (store.status == "Pending") {
      res.status(200).json({
        message: `Cannot add product! Store's status is still pending for approval!`,
        data: {},
      });
    }
    if (store.status == "Blocked") {
      res.status(200).json({
        message: `Cannot add product! Store is blocked temporarily for violating community rules!`,
        data: {},
      });
    }
    const isProductNamePresent = await Product.findOne({
      name: req.body.name,
      storeID: storeId,
    });
    if (isProductNamePresent) {
      throw new Error("Product with this name already added before.");
    }

    req.body["storeID"] = store._id;
    req.body["storeName"] = store.name;
    req.body["sellerID"] = store.sellerId;
    req.body["sellerName"] = store.sellerName;
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      message: `Product has been added successfully to store!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const addProductByStoreName = async (req, res, next) => {
  try {
    const storeName = req.params.name;
    const store = await Store.findOne({ name: storeName });
    //check if product name added before in this store DB
    if (!store) {
      throw new Error("Please register store to add Product.");
    }
    //check if store is not pending or blocked
    if (store.status == "Pending") {
      throw new Error(
        `Cannot add product! Store's status is still pending for approval!`
      );
    }
    if (store.status == "Blocked") {
      throw new Error(
        `Cannot add product! Store is blocked temporarily for violating community rules!`
      );
    }
    const isProductNamePresent = await Product.findOne({
      name: req.body.name,
      storeID: store._id,
    });
    if (isProductNamePresent) {
      throw new Error("Product with this name already added before.");
    }

    req.body["storeID"] = store._id;
    req.body["storeName"] = store.name;
    req.body["sellerID"] = store.sellerId;
    req.body["sellerName"] = store.sellerName;
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      message: `Product has been added successfully to store!`,
      data: {
        product: product,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

module.exports = {
  //SELLER
  addProductToMyStore,
  updateProduct,
  deleteProduct,
  viewMyStoreAllProducts,
  viewStoreOwnProducts,
  viewStoreProductsSelectedByVendorsProducts,
  viewMyStoreProduct,
  countMyStoreProductsStock,
  countTotalExpenseOfProducts,
  deleteAllProductsOfStore,
  //ADMIN
  viewAllProductsInAllStores,
  viewProductDetails,
  viewProductsOfStore,
  blockProduct,
  unblockProduct,
  getTotalNumberOfProducts,
  editProductById,
  deleteProductById,
  addProductByStoreId,
  addProductByStoreName,
  //BUYER
  viewProductsOfSpecificCategory,
  viewProductsOfSpecificSubCategory,
  viewProductsOnSale,
  viewTopReviewedProducts,
  searchProducts,
  viewProductsOfStoreById,
  filterProducts,
  getTopSellingProducts,
  viewAllProductsInAllStoresForBuyer,
  getProductDetailsForBuyer,
};
