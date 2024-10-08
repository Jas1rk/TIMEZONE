const User = require("../model/userModel");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");

const isUser = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/");
    } else {
      next();
    }
  } catch (err) {
    console.log(err.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.session.admin) {
      next();
    } else {
      res.redirect("/admin");
    }
  } catch (err) {
    console.log(err.message);
  }
};

const isBlocked = async (req, res, next) => {
  try {
    if (req.session.user) {
      const data = await User.findOne({ email: req.session.user.email });

      if (data.isBlocked == true) {
        res.render("userlogin");
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

const isLogged = async (req, res, next) => {
  try {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
};

const isproductBlock = async (req, res, next) => {
  try {
    const id = req.query._id;
    const data = await Product.find({ _id: id });

    if (data.isBlocked === true) {
      res.redirect("/");
    } else {
      next();
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  isUser,
  isAdmin,
  isLogout,
  isBlocked,
  isLogged,
  isproductBlock,
};
