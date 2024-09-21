const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const Offer = require("../model/offerModel");

const adminOfferGet = async (req, res) => {
  try {
    const [offers, categories] = await Promise.all([
      Category.find({ isBlocked: false }),
      Offer.find({}),
    ]);

    res.render("admin/offers", { categories, offers });
  } catch (err) {
    console.log(err);
  }
};

const adminCreateOffer = async (req, res) => {
  try {
    const { categoryDiscount, endingDate, startingDate, selectCategory } =
      req.body;
    const categoryFind = await Category.findOne({ name: selectCategory });
    console.log(categoryFind);
    const existingOfferOfCategory = await Offer.findOne({
      category: categoryFind._id,
    });
    if (existingOfferOfCategory) {
      console.log("exist offer");
      res.json({ status: "exist" });
    } else {
      const newCategoryOffer = new Offer({
        category: categoryFind._id,
        startingDate: startingDate,
        endingDate: endingDate,
        percentage: categoryDiscount,
      });
      console.log("offer created", newCategoryOffer);
      await newCategoryOffer.save();
      res.json({});
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  adminOfferGet,
  adminCreateOffer,
};
