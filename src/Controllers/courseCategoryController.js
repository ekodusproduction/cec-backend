import Joi from "joi";
import categoryModel from "../server.js";
import courseModel from "../server.js";

export const createCategory = async (req, res, next) => {
  try {
    let { category } = req.body;

    const schema = Joi.object({
      category: Joi.string()
        .min(3)
        .max(30)
        .required(),
    });

    let data = { category };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    data = await categoryModel.create({ category });

    return res.status(201).send({
      data: data,
      message: "course Created succesfully",
      status: "ok",
    });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const courses = await categoryModel.find({});
    return res.status(200).send({ data: courses, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateCateory = async (req, res, next) => {
  try {
    const { category } = req.body;
    const { categoryId } = req.params;

    const schema = Joi.object({
      category: Joi.string().required(),
      categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$}/).required(),
    });

    let data = { categoryId, category };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const categories = await categoryModel.findOneAndUpdate(
      { _id: categoryId.categoryId },
      { category },
      { new: true }
    );
    return res.status(200).send({ data: categories, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    const categoryId = req.params;

    const schema = Joi.object({
      category: Joi.string().required(),
      categoryId: Joi.string().regex(/^[0-9a-fA-F]{24}$}/).required(),
    });

    let data = { categoryId, category };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const categories = await categoryModel.deleteOne({
      _id: categoryId.categoryId,
    });
    return res.status(202).send({ data: categories, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
