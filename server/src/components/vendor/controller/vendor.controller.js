const VendorProduct = require("../../products/model/vendorProduct.model");
const Vendor = require("../model/vendor.model");

//added vendor by admin so active
const addVendor = async (req, res, next) => {
  try {
    const isPresent = await Vendor.findOne({
      companyName: req.body.companyName,
    });
    if (isPresent) {
      res.status(200).json({
        message: ` Vendor with this name is already present.`,
        data: {},
      });
    } else {
      req.body.status = "Active";
      const vendor = new Vendor(req.body);
      await vendor.save();
      res.status(201).json({
        message: `Vendor has been added successfully!`,
        data: {
          vendor,
        },
      });
    }
  } catch (e) {
    e.status = 404;
    next(e);
  }
};

const requestVendor = async (req, res, next) => {
  try {
    const isPresent = await Vendor.findOne({
      companyName: req.body.companyName,
    });
    if (isPresent) {
      res.status(200).json({
        message: ` Vendor with this name is already present.`,
        data: {},
      });
    } else {
      const vendor = new Vendor(req.body);
      await vendor.save();
      res.status(201).json({
        message: `Vendor has been requested successfully!`,
        data: {
          vendor,
        },
      });
    }
  } catch (e) {
    e.status = 404;
    next(e);
  }
};

const deleteVendor = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const vendor = await Vendor.findOneAndDelete({ _id: _id });
    if (!vendor) {
      throw new Error("Vendor not found!");
    }
    //delete all vendor products
    await VendorProduct.deleteMany({ vendorId: _id });

    res.status(200).json({
      message: `Vendor has been deleted successfully!`,
      data: {
        vendor,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getVendorById = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const vendor = await Vendor.findOne({ _id: _id });
    if (!vendor) {
      throw new Error("Vendor not found!");
    }
    res.status(200).json({
      message: `Vendor has been fetched successfully!`,
      data: {
        vendor,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find({});
    res.status(200).json({
      message: `Vendors list has been fetched successfully!`,
      data: {
        vendors,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getAllPendingVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find({ status: "Pending" });
    res.status(200).json({
      message: `Pending Vendors list has been fetched successfully!`,
      data: {
        vendors,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getAllActiveVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find({ status: "Active" });
    res.status(200).json({
      message: `Active Vendors list has been fetched successfully!`,
      data: {
        vendors,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getAllBlockedVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find({ status: "Blocked" });
    res.status(200).json({
      message: `Blocked Vendors list has been fetched successfully!`,
      data: {
        vendors,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getAllVendorsByCategoryName = async (req, res, next) => {
  try {
    const categoryName = req.params.category;
    const vendors = await Vendor.find({ category: categoryName });
    res.status(200).json({
      message: `Vendors list has been fetched successfully!`,
      data: {
        vendors,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const updateVendor = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body);
    const vendorID = req.params.id;
    const vendor = await Vendor.findOne({ _id: vendorID });
    //set all products visisbilty to false if block vendor
    if (req.body.status == "Blocked") {
      const products = await VendorProduct.find({ vendorId: vendorID });
      products.forEach(async (product) => {
        product.isVisibilityEnabled = false;
        await product.save();
      });
      //logout from all devices
      vendor.tokens = [];
    }

    //set all products visisbilty to true if active vendor
    if (req.body.status == "Active") {
      const products = await VendorProduct.find({ vendorId: vendorID });
      products.forEach(async (product) => {
        product.isVisibilityEnabled = true;
        await product.save();
      });
    }
    updates.forEach((update) => (vendor[update] = req.body[update]));
    await vendor.save();
    res.status(200).json({
      message: `Vendor has been updated successfully!`,
      data: {
        vendor,
      },
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};


//FOR BRANDS OF VENDOR

module.exports = {
  addVendor,
  deleteVendor,
  updateVendor,
  getVendorById,
  getAllVendors,
  getAllVendorsByCategoryName,
  getAllActiveVendors,
  getAllPendingVendors,
  getAllBlockedVendors,
  requestVendor,
};
