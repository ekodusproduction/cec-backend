import Joi from "joi";
import courseModel from "../Models/courseModel.js";
import qualificationModel from "../Models/qualificationModel.js";
import categoryModel from "../Models/courseCategoryModel.js";

export const createCourse = async (req, res, next) => {
  try {
    const {
      courseName,
      courseCode,
      // category,
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
      courseCode: Joi.string().required(),
      // category: Joi.string().required(),
      duration: Joi.number()
        .min(1)
        .required(),
      qualificationType: Joi.string().required(),
      courseFee: Joi.number().required(),
      courseDescription: Joi.string()
        .min(3)
        .max(50)
        .required(),
    });
    const courseCodeExist = await courseModel.findOne({ courseCode });
    if (courseCodeExist) {
      return res.status(400).send({
        message: "Course code exist. Please send another course code",
      });
    }
    const courseNameExist = await courseModel.findOne({ courseName });
    if (courseNameExist) {
      return res.status(400).send({
        message: "Course name exist. Please send another course name",
      });
    }

    let data = {
      courseName,
      courseCode,
      // category,
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

    const course = await courseModel.create(data);
    const DATA = await courseModel
      .findById(course._id)
      .populate({ path: "qualificationType", model: qualificationModel });

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
      .lean()
      .sort({ createdAt: -1 });

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

    const qualification = await qualificationModel.findById(qualificationId).lean();

    if (!qualification) {
      return res
        .status(404)
        .send({ message: "Qualification not found.", status: "fail" });
    }
    let courses = await courseModel
      .find({})
      .populate({ path: "qualificationType", model: qualificationModel }).lean();

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
