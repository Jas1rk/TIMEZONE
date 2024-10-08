const User = require("../model/userModel");
const Product = require("../model/productModel");
const Wishlist = require("../model/wishlistModel");
const Cart = require("../model/cartModel");

const getWishlistPage = async (req, res) => {
  try {
    const userId = req.session.user;
    const productswish = await Wishlist.findOne({ user: userId._id }).populate(
      "products.productId"
    );

    let cartStatus = false;
    const cartFind = await Cart.findOne({ user: userId._id }).populate(
      "products.productId"
    );
    if (cartFind) {
      cartStatus = productswish.products.map((wishlistProduct) => {
        const wishlistProductId = wishlistProduct.productId.toString();
        const fountInCart = cartFind.products.some((cartProduct) => {
          const cartProductId = cartProduct.productId.toString();
          const isEqual = cartProductId === wishlistProductId;
          return isEqual;
        });

        return fountInCart;
      });
    }
    const headerStatusWishlist = cartFind ? cartFind.products.length : 0;

    res.render("wishlist", { productswish, cartStatus, headerStatusWishlist });
  } catch (err) {
    console.log(err.message);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const userId = req.session.user;
    const { pid } = req.body;
    const userData = await User.findOne(userId);
    const productDat = await Product.findOne({ _id: pid });
    const wishlistData = await Wishlist.findOne({ user: userData._id });
    if (wishlistData) {
      const findproductinwishlist = await Wishlist.findOne({
        user: userId._id,
        "products.productId": pid,
      });
      if (findproductinwishlist) {
        console.log("product is already in wishlist");
        res.json({ status: "viewwishlistcheck" });
      } else {
        const uData = await Wishlist.findOneAndUpdate(
          { user: userData._id },
          {
            $push: {
              products: [{ productId: pid }],
            },
          }
        );
        console.log("product addesd", uData);

        res.json({ status: "viewwishlist" });
      }
    } else {
      console.log("gjhgjh");
      const newWish = new Wishlist({
        user: userData._id,
        products: [
          {
            productId: pid,
          },
        ],
      });
      console.log("created products in ", newWish);
      await newWish.save();
      res.json({ status: true });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const userDeleteWishlist = async (req, res) => {
  try {
    const userId = req.session.user;
    const { pid } = req.body;
    const findWish = await Wishlist.findOne({
      user: userId,
      "products.productId": pid,
    });
    if (findWish) {
      const deletewishlist = await Wishlist.updateOne(
        { user: userId, "products.productId": pid },
        {
          $pull: { products: { productId: pid } },
        }
      );
      res.json({ status: "delete" });
    } else {
      console.log("connot find cart");
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  getWishlistPage,
  addToWishlist,
  userDeleteWishlist,
};
