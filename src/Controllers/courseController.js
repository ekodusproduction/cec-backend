import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import studentModel from "../Models/studentModel.js";
import fs from "fs/promises";
import Joi from "joi";
import APIFeatures from "../Utils/apiFeatures.js";
import courseModel from "../Models/courseModel.js";
import qualificationModel from "../Models/qualificationModel.js";
import categoryModel from "../Models/courseCategoryModel.js";

export const createCourse = async (req, res, next) => {
  try {
    const {
      courseName,
      courseCode,
      category,
      duration,
      qualificationType,
      courseFee,
      courseDescription,
    } = req.body;

    const schema = Joi.object({
      courseName: Joi.string()
        .min(3)
        .max(50)
        .required(),
      courseCode: Joi.string()
        .min(3)
        .max(6)
        .required(),
      category: Joi.string().required(),
      duration: Joi.string()
        .min(1)
        .required(),
      qualificationType: Joi.string().required(),
      courseFee: Joi.number().required(),
      courseDescription: Joi.string()
        .min(3)
        .max(50)
        .required(),
    });

    let data = {
      courseName,
      courseCode,
      category,
      duration,
      qualificationType,
      courseFee,
      courseDescription,
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const createCourse = {
      courseName,
      courseCode,
      category,
      duration,
      qualificationType,
      courseFee,
      courseDescription,
    };
    const course = await courseModel.create(createCourse);
    const DATA = await courseModel
      .findById(course._id)
      .populate({ path: "qualificationType", model: qualificationModel })
      .populate({ path: "category", model: categoryModel });

    return res.status(201).send({
      data: DATA,
      message: "course Created succesfully",
      status: "ok",
    });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const courses = await courseModel
      .find({})
      .populate({ path: "qualificationType", model: qualificationModel })
      .populate({ path: "category", model: categoryModel });

    return res.status(200).send({ data: courses, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const filterCourses = async (req, res, next) => {
  try {
    const { qualificationId } = req.params;
    if (!qualificationId) {
      return res
        .status(400)
        .send({ message: "invalid request. please send id" });
    }

    const qualification = await qualificationModel.findById(qualificationId);

    if (!qualification) {
      return res
        .status(404)
        .send({ message: "Qualification not found.", status: "fail" });
    }
    console.log(qualification);
    let courses = await courseModel
      .find({})
      .populate({ path: "qualificationType", model: qualificationModel })
      .populate({ path: "category", model: categoryModel });


    courses = courses.filter(
      (item) => item.qualificationType.value <= qualification.value
    );

    return res.status(200).send({ data: courses, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { updateField, updateValue } = req.body;
    const { courseId } = req.params;
    console.log("tyyype", typeof courseId);
    console.log("updateField", typeof updateField);

    const schema = Joi.object({
      courseId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      updateField: Joi.string()
        .min(3)
        .required(),
      updateValue: Joi.string()
        .min(3)
        .required(),
    });

    let data = {
      updateField,
      updateValue,
      courseId,
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }
    if (updateField == "courseFee") {
      updateValue = Math.trunc(updateValue);
    }

    const dynamicUpdate = { [updateField]: updateValue };
    const course = await courseModel.findByIdAndUpdate(
      { _id: courseId },
      { $set: dynamicUpdate },
      { new: true }
    );
    return res.status(200).send({ data: course, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params;
    if (!courseId) {
      return res.status(400).send({
        message: "invalid request please provide courseId",
        status: "fail",
      });
    }
    const course = await courseModel.deleteOne({ _id: courseId.courseId });
    return res.status(202).send({ data: course, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
