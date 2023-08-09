import centerModel from "../Models/centerModel.js";
import studentModel from "../Models/studentModel.js";
import fs from "fs/promises";
import APIFeatures from "../Utils/apiFeatures.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Joi from "joi";
import { sendMessage } from "../Airtel/airtel.js";
import courseModel from "../Models/courseModel.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);
const baseUrl = `139.59.83.187`;

export const studentRegister = async (req, res, next) => {
  try {
    let {
      firstName,
      lastName,
      DOB,
      mobile,
      qualification,
      pinCodePresent,
      presentAddress,
      cityPresent,
      statePresent,
      permanentAddress,
      statePermanent,
      cityPermanent,
      pinCodePermanent,
      centerCode,
    } = req.body;

    centerCode = centerCode*1;
    let schema = Joi.object({
      firstName: Joi.string()
        .min(3)
        .required(),
      lastName: Joi.string()
        .min(3)
        .required(),
      DOB: Joi.string()
        .min(3)
        .required(),
      mobile: Joi.string()
        .min(9)
        .required(),
      qualification: Joi.string()
        .min(3)
        .required(),
      pinCodePresent: Joi.number()
        .min(100000)
        .max(999999)
        .required(),
      presentAddress: Joi.string()
        .min(1)
        .max(100)
        .required(),
      permanentAddress: Joi.string()
        .min(1)
        .max(100)
        .required(),
      cityPresent: Joi.string()
        .min(3)
        .required(),
      statePresent: Joi.string()
        .min(1)
        .required(),
      cityPermanent: Joi.string()
        .min(3)
        .required(),
      statePermanent: Joi.string()
        .min(1)
        .required(),
      pinCodePermanent: Joi.number()
        .min(100000)
        .max(999999)
        .required(),
        centerCode: Joi.number().required(),
    });

    let data = {
      firstName,
      lastName,
      DOB,
      mobile,
      qualification,
      pinCodePresent,
      presentAddress,
      cityPresent,
      statePresent,
      permanentAddress,
      statePermanent,
      cityPermanent,
      pinCodePermanent,
      centerCode,
    };
    let { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }
    let convertToDate = (DOB) => {
      let [year, day, month] = DOB.split("-").map(Number);
      return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date, so subtract 1 from the month value.
    };

    data.DOB = convertToDate(DOB);
    


    let center = await centerModel.findOne({centerCode:centerCode});
    data.centerId = center._id;
    if (!center) {
      return res
        .status(404)
        .send({ data: { message: "center not found" }, status: "fail" });
    }

    let student = await studentModel.create(data);
    let text = `Student registered succesfully with CEC. To generate rollnumber please pay for the course`;
    // sendMessage(text, mobile);
    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const generateRollNumber = async (req, res, next) => {
  try {
    const { studentId } = req.body;

    const schema = Joi.object({
      studentId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
    });

    let data = {
      studentId,
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const updatedStudent = await studentModel.findOneAndUpdate(
      {
        _id: studentId,
        "course.courseId": courseId,
        "course.paymentStatus": "paid",
      },
      { $set: { "course.$.paymentStatus": "paid" } },
      { new: true }
    );

    if (!updatedStudent) {
      return res
        .status(400)
        .send({ message: "Payment not done or invalid data.", status: "fail" });
    }

    const regCenter = await centerModel.findById(centerId);
    const count = await studentModel.countDocuments({
      center: centerId,
      regYear: new Date().getFullYear(),
    });
    const rollNumber = `${(count % 1000) +
      1}${`${new Date().getFullYear()}`.slice(-2)}${regCenter.franchiseCode}`;

    const updateStudent = await studentModel.findByIdAndUpdate(studentId, {
      $set: { rollNumber: rollNumber },
    });

    const text = `Payment succesfull. Your roll number is ${rollNumber} `;
    sendMessage(text, mobile);
    return res.status(200).send({ data: updateStudent, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getallStudent = async (req, res, next) => {
  try {
    let center;
    let doc;
    let page = req.query.page * 1 || 1;

    let limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    if (req.query.centerId) {
      center = await studentModel
        .find({
          isActive: true,
          centerId: req.query.centerId,
        })
        .skip(skip)
        .limit(limit)
        .populate({ path: "centerId", model: centerModel })
        .populate({ path: "course", model: courseModel });
    } else {
      center = studentModel
        .find({
          isActive: true,
        })
        .skip(skip)
        .limit(limit)
        .populate({ path: "centerId", model: centerModel })
        .populate({ path: "course", model: courseModel });
    }

    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err, status: "fail" });
  }
};

export const getallInactiveStudent = async (req, res, next) => {
  try {
    const center = await studentModel.find({ isActive: false });
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getStudent = async (req, res, next) => {
  try {
    if (!req.params.centerid) {
      return res.status(400).send({
        data: { message: "invalid request. please provide centerId" },
        status: "fail",
      });
    }
    const center = await studentModel.find({ centerId: req.params.centerid });
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const addNewCourse = async (req, res, next) => {
  try {
    const { id, courseId, paymentId } = req.body;

    const schema = Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      courseId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      paymentId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
    });

    let data = {
      id,
      courseId,
      paymentId,
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const student = await studentModel.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { course: courseId } },
      { new: true }
    );

    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const { id, updateField, updateValue } = req.body;

    const schema = Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      updateField: Joi.string().required(),
      updateValue: Joi.string().required(),
    });
    let data = { id, updateField, updateValue };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }
    const updateObject = {};
    updateObject[updateField] = updateValue;

    const updatedStudent = await studentModel.findByIdAndUpdate(
      id,
      { $set: updateObject },
      { new: true }
    );

    return res.status(200).send({ data: updatedStudent, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const fileUploads = async (req, res, next) => {
  try {
    const { rollNumber } = req.body;
    if (!rollNumber) {
      return res
        .status(400)
        .send({ message: "invalid request. send rollNumber", status: "fail" });
    }
    const file = req.files[0];

    if (!file) {
      return res
        .status(400)
        .send({ message: "invalid request. send file", status: "fail" });
    }
    const imageType = ["profilePic", "Id", "addressProof", "acadCert"];

    if (!imageType.contains(file.fieldname)) {
      return res.status(400).send({ message: "invalid type", status: "fail" });
    }

    const imgBuffer = Buffer.from(file.buffer, "utf-8");
    const user = await studentModel.findOne({ rollNumber });
    if (!user) {
      return res
        .status(400)
        .send({ message: "invalid user id in token. login again" });
    }

    await fs.writeFile(
      join(
        __dirname +
          `/../../public/student/${rollNumber.toString()}${file.fieldname}.${
            file.mimetype.split("/")[1]
          }`
      ),
      imgBuffer,
      "utf-8"
    );

    const profilePic = `${baseUrl}/public/student/${rollNumber.toString()}${
      file.fieldname
    }.${file.mimetype.split("/")[1]}`;
    console.log("profilePic", file);
    const userupdate = await studentModel.updateOne(
      { rollNumber },
      { profilePic: profilePic }
    );

    return res.status(200).send({ data: userupdate, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { id, email, password } = req.body;

    const schema = Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      email: Joi.string()
        .min(11)
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
    });
    let data = { id, email, password };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const deleteStudent = await studentModel.find;
    return res.status(200).send({ data: deleteStudent, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
