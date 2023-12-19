import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    // Checking if category exists
    const existingCategory = await categoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "The category already exists",
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      success: true,
      message: "Category Added",
      category,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Category Added Successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating the category",
      error,
    });
  }
};

export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "Got the categories",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "There was an error getting the categories",
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      category,
      message: "Got single category sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting a single category",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Deleted category sucessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting a deleting category",
    });
  }
};
