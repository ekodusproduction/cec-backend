import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import studentModel from "../Models/studentModel.js";
import categoryModel from "../Models/courseCategoryModel.js";
import fs from "fs/promises";
import APIFeatures from "../Utils/apiFeatures.js";
import courseModel from "../Models/centerModel.js";

export const createCategory = async (req, res, next) => {
  try {
    let { category, centerId } = req.body;
    const data = await categoryModel.create({ category });
    const isSuperAdmin = await superAdminModel.findById(req.id);

    if (centerId != undefined) {
      const categories = await centerModel.findByIdAndUpdate(centerId, {
        $push: { categories: data.id },
      });
      return res
        .status(201)
        .send({
          data: data,
          message: "course Created succesfully",
          status: "ok",
        });
    }
    return res
      .status(201)
      .send({
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
    const isSuperAdmin = await superAdminModel.findById(req.id);
    if (!isSuperAdmin) {
      const categories = await centerModel
        .find({ headOfInstitute: req.id })
        .populate("categories")
        .select("categories");
      return res.status(200).send({ data: categories, status: "ok" });
    }
    const courses = await categoryModel.find({});
    return res.status(200).send({ data: courses, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateCateory = async (req, res, next) => {
  try {
    const { category } = req.body;
    const categoryId = req.params;
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
    const categoryId = req.params;
    const centerId = req.query;
    if (centerId) {
      const centerUpdate = await centerModel.updateOne(
        { _id: categoryId.categoryId },
        { $pull: { categories: categoryId } }
      );
      return res.status(202).send({ data: centerUpdate, status: "ok" });
    }
    const categories = await categoryModel.deleteOne({
      _id: categoryId.categoryId,
    });
    return res.status(202).send({ data: categories, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
