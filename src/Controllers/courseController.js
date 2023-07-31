import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import studentModel from "../Models/studentModel.js";
import fs from "fs/promises";
import APIFeatures from "../Utils/apiFeatures.js";
import courseModel from "../Models/courseModel.js";

export const createCourse = async (req, res, next) => {
  try {
    const {
      courseName,
      courseCode,
      category,
      duration,
      qualificationType,
      courseFee,
      courseType,
    } = req.body;
    const createCourse = {
      courseName,
      courseCode,
      category,
      duration,
      qualificationType,
      courseFee,
      courseType,
    };
    const course = await courseModel.create(createCourse);
    const DATA = await courseModel
      .findById(course._id)
      .populate("qualificationType");

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
    const courses = await courseModel.find({});
    return res.status(200).send({ data: courses, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { updateField, updateValue } = req.body;
    const courseId = req.params;
    const course = await courseModel.findByIdAndUpdate(
      { _id: courseId.courseId },
      { $set: { [updateField]: updateValue } , new:true}
    );
    return res.status(200).send({ data: course, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const courseId = req.params;
    const course = await courseModel.deleteOne({ _id: courseId.courseId });
    return res.status(202).send({ data: course, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
