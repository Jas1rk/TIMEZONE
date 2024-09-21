const { json } = require("express");
const Category = require("../model/categoryModel");

const admincategory = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.render("admin/categoryadmin", { categories });
  } catch (err) {
    console.log(err.message);
  }
};

const admincategoryPost = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name: name });
    if (!existingCategory) {
      const newCategory = new Category({
        name: name,
        description: description,
      });
      await newCategory.save();
      res.redirect("/admin/admincategory");
    } else {
      const categories = await Category.find({});
      res.render("admin/categoryadmin", {
        message1: "Category already exist",
        categories,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const adminCategoryBlock = async (req, res) => {
  try {
    const categories = req.query._id;
    const data = await Category.findByIdAndUpdate(categories, {
      isBlocked: true,
    });
    res.redirect("/admin/admincategory");
  } catch (err) {
    console.log(err.message);
  }
};

const adminCategoryUnblock = async (req, res) => {
  try {
    const categories = req.query._id;
    const data = await Category.findByIdAndUpdate(categories, {
      isBlocked: false,
    });
    res.redirect("/admin/admincategory");
  } catch (err) {
    console.log(err.message);
  }
};

const adminCategoryEditGet = async (req, res) => {
  try {
    const cateid = req.query._id;
    console.log(cateid);
    req.session.catId = cateid;
    const editId = await Category.findById({ _id: cateid });
    res.render("admin/admincategoryedit", { editId });
  } catch (err) {
    console.log(err.message);
  }
};

const adminCategoryEditPost = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existingCategory = await Category.findOne({ name: name });
    const editId = await Category.findById({ _id: req.session.catId });
    if (
      existingCategory &&
      existingCategory._id.toString() !== req.session.catId
    ) {
      res.render("admin/admincategoryedit", {
        mess: "Name already exists in another category",
        editId,
      });
      return;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: req.session.catId },
      { $set: { name, description } },
      { new: true }
    );

    console.log(updatedCategory);
    res.redirect("/admin/admincategory");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  admincategory,
  admincategoryPost,
  adminCategoryBlock,
  adminCategoryUnblock,
  adminCategoryEditGet,
  adminCategoryEditPost,
};
