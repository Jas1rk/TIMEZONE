const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    user: {
      type: Array,
      default: [],
    },
    cname: {
      type: String,
    },
    startdate: {
      type: String,
    },
    enddate: {
      type: String,
    },
    minimumpurchase: {
      type: Number,
    },
    ccode: {
      type: String,
    },
    percentage: {
      type: Number,
    },
    isblocked: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
