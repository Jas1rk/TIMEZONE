const express = require("express");
const admin_router = express.Router();
const admincontroller = require("../controller/adminController");
const userlistcontroller = require("../controller/userListConstroller");
const adminCategoryController = require("../controller/categoryController");
const productcontroller = require("../controller/productController");
const orderController = require("../controller/orderController");
const sortController = require("../controller/sortController");
const salesController = require("../controller/salesController");
const couponController = require("../controller/couponController");
const offerController = require("../controller/offerManagement");
const upload = require("../controller/multer/multer");
const middle = require("../middlewares/auth");

admin_router.get("/admindash", middle.isAdmin, admincontroller.adminDashGet);
admin_router.get(
  "/monthlydata",
  middle.isAdmin,
  admincontroller.displayMonthlyData
);
admin_router.get(
  "/yearlydata",
  middle.isAdmin,
  admincontroller.displayYearlyData
);
admin_router.get("/", admincontroller.adiminlogGet);
admin_router.post("/", admincontroller.adminlogPost);
admin_router.get("/logout", admincontroller.logoutAdmin);

admin_router.get("/userList", middle.isAdmin, userlistcontroller.loadUserList);
admin_router.get("/userBlock", middle.isAdmin, userlistcontroller.blockUser);
admin_router.get(
  "/userUnblock",
  middle.isAdmin,
  userlistcontroller.unblockUser
);

admin_router.get(
  "/admincategory",
  middle.isAdmin,
  adminCategoryController.admincategory
);
admin_router.post(
  "/admincategory",
  middle.isAdmin,
  adminCategoryController.admincategoryPost
);
admin_router.get(
  "/categoryblock",
  middle.isAdmin,
  adminCategoryController.adminCategoryBlock
);
admin_router.get(
  "/categoryunblock",
  middle.isAdmin,
  adminCategoryController.adminCategoryUnblock
);
admin_router.get(
  "/categoryedit",
  middle.isAdmin,
  adminCategoryController.adminCategoryEditGet
);
admin_router.post(
  "/categoryedit",
  middle.isAdmin,
  adminCategoryController.adminCategoryEditPost
);

admin_router.get(
  "/productadmin",
  middle.isAdmin,
  productcontroller.adminProductsGet
);
admin_router.get(
  "/addproduct",
  middle.isAdmin,
  productcontroller.addProductGet
);
admin_router.post(
  "/addproduct",
  middle.isAdmin,
  upload.array("image"),
  productcontroller.addProductPost
);
admin_router.get(
  "/productedit",
  middle.isAdmin,
  productcontroller.adminProductEdit
);
admin_router.post(
  "/producteditpost",
  middle.isAdmin,
  upload.array("image"),
  productcontroller.adminEditProductPost
);
admin_router.get(
  "/blockproduct",
  middle.isAdmin,
  middle.isAdmin,
  productcontroller.adminProductBloack
);
admin_router.get(
  "/unblockproduct",
  middle.isAdmin,
  productcontroller.adminUnblockproduct
);
admin_router.post(
  "/deleteimage",
  middle.isAdmin,
  productcontroller.deleteImage
);

admin_router.get("/orderslist", middle.isAdmin, orderController.adminOrderList);
admin_router.get(
  "/orderdetails",
  middle.isAdmin,
  orderController.adminOrderDetails
);
admin_router.post("/status", middle.isAdmin, orderController.statusChanging);

admin_router.get("/sales", middle.isAdmin, salesController.salesReportGet);
admin_router.post(
  "/sales",
  middle.isAdmin,
  salesController.filterSalesReportbyDate
);
admin_router.post(
  "/daterangesales",
  middle.isAdmin,
  salesController.filteringDateRange
);
admin_router.get("/generate-pdf", middle.isAdmin, salesController.genaratePDF);

admin_router.get(
  "/coupons",
  middle.isAdmin,
  couponController.allCouponsGetPage
);
admin_router.get("/addcoupon", middle.isAdmin, couponController.addcouponGet);
admin_router.post("/addcoupon", middle.isAdmin, couponController.addCouponPost);
admin_router.post("/blockcoupon", middle.isAdmin, couponController.blockCoupon);
admin_router.post(
  "/unblockcoupon",
  middle.isAdmin,
  couponController.unblockCoupon
);
admin_router.delete(
  "/deletecoupon",
  middle.isAdmin,
  couponController.deleteCoupon
);

admin_router.get("/offers", middle.isAdmin, offerController.adminOfferGet);
admin_router.post("/offers", middle.isAdmin, offerController.adminCreateOffer);

module.exports = admin_router;
