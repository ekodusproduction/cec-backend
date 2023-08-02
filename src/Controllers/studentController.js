import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import studentModel from "../Models/studentModel.js";
import fs from "fs/promises";
import APIFeatures from "../Utils/apiFeatures.js";
import courseModel from "../Models/centerModel.js";
import { dirname } from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import Joi from "joi";
import { sendMessage } from "../Airtel/airtel.js";
import { generateToken } from "../Auth/authentication.js";
import upload from "../app.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);

export const studentRegister = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      DOB,
      mobile,
      qualification,
      pinCodePresent,
      presentAddress,
      cityPresent,
      houseNumberPresent,
      permanentAddress,
      houseNumberPermanent,
      cityPermanent,
      pinCodePermanent,
      centerId,
    } = req.body;

    const schema = Joi.object({
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
        .min(3)
        .required(),
      presentAddress: Joi.string()
        .min(3)
        .required(),
      cityPresent: Joi.string()
        .min(3)
        .required(),
      houseNumberPresent: Joi.string()
        .min(3)
        .required(),
      cityPermanent: Joi.string()
        .min(3)
        .required(),
      houseNumberPermanent: Joi.string()
        .min(3)
        .required(),
      pinCodePermanent: Joi.number()
        .min(3)
        .required(),
      centerId: Joi.string()
        .min(3)
        .required(),
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
      houseNumberPresent,
      permanentAddress,
      houseNumberPermanent,
      cityPermanent,
      pinCodePermanent,
      centerId,
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const center = await centerModel.findById(centerId);
    if (!center) {
      return res
        .status(404)
        .send({ data: { message: "center not found" }, status: "fail" });
    }
    // const count = await studentModel.find({
    //   center: centerId,
    //   regYear: new Date().getFullYear,
    //   course,
    // }).length;
    // const rollNumber = `${count + 1}${`${new Date().getFullYear}`.slice(-2)}${
    //   center.franchiseCode
    // }`;

    const student = await studentModel.create(data);
    const text = `Student registered succesfully with CEC. To generate rollnumber please pay for the course`;
    // sendMessage(text, mobile);
    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const generateRollNumber = async (req, res, next) => {
  try {
    const { paymentId, orderId, centerId, studentId } = req.body;

    const schema = Joi.object({
      paymentId: Joi.string()
        .min(3)
        .required(),
      orderId: Joi.string()
        .min(3)
        .required(),
      centerId: Joi.string()
        .min(3)
        .required(),
      studentId: Joi.string()
        .min(9)
        .required(),
    });

    let data = {
      paymentId,
      orderId,
      centerId,
      studentId,
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const center = await centerModel.findById(centerId);
    const count = await studentModel.countDocuments({
      center: centerId,
      regYear: new Date().getFullYear,
    });
    const rollNumber = `${(count % 1000) + 1}${`${
      new Date().getFullYear
    }`.slice(-2)}${center.franchiseCode}`;
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
    const center = await studentModel.find({});
    return res.status(200).send({ data: center, token: token, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getStudent = async (req, res, next) => {
  try {
    if (!req.params.centerId) {
      return res.status(400).send({
        data: { message: "invalid request. please provide centerId" },
        status: "fail",
      });
    }
    const center = await studentModel.find({ center: req.params.centerid });
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const addNewCourse = async (req, res, next) => {
  try {
    const { id, course, paymentId, orderId, centerId } = req.body;

    const schema = Joi.object({
      id: Joi.string()
        .min(3)
        .required(),
      course: Joi.string()
        .min(3)
        .required(),
      paymentId: Joi.string()
        .min(3)
        .required(),
      orderId: Joi.string()
        .min(3)
        .required(),
      centerId: Joi.string()
        .min(9)
        .required(),
    });

    let data = {
      id,
      course,
      paymentId,
      orderId,
      centerId,
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const student = await studentModel.findByIdAndUpdate(id, {
      $addToSet: { course },
    });
    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const { id, updateField, updateValue } = req.body;

    const schema = Joi.object({
      id: Joi.string().required(),
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

    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const fileUploads = async (req, res, next) => {
  try {
    const { id, rollNumber } = req.body;

    await fs.mkdir(appDir + `../../public/student/${rollNumber}`, {
      recursive: true,
    });
    let fileNames = {};
    for (let i = 0; i < req.files.length; i++) {
      const extension = req.files[i].mimetype.split("/")[1];
      const fileName = req.files[i].fieldname;
      const path = `${baseUrl}/public/student/${rollNumber}/${fileName}.${extension}`;
      fileNames[fileName] = path;
      const imgBuffer = Buffer.from(req.files[i].buffer, "utf-8");
      const profilePic = `/public/student/${rollNumber}/${
        req.files[i].fieldname
      }.${req.files[i].mimetype.split("/")[1]}`;
      await fs.writeFile(
        appDir +
          `../../public/student/${rollNumber}/${req.files[i].fieldname}.${
            req.files[i].mimetype.split("/")[1]
          }`,
        imgBuffer,
        "utf-8"
      );
      const fileUpload = await studentModel.findOneAndUpdate(
        { rollNumber },
        { $set: { fileName: path } }
      );
    }

    const center = await studentModel.findOne({ rollNumber });

    return res.status(200).send({ data: center, token: token, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { id, email, password } = req.body;

    const schema = Joi.object({
      id: Joi.string().required(),
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
    return res
      .status(200)
      .send({ data: deleteStudent, token: token, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
