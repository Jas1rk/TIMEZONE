const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },

      price: {
        type: Number,
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
  },
});
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
