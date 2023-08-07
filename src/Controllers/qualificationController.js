

import { dirname } from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import Joi from "joi";
import qualificationModel from "../Models/qualificationModel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);
dotenv.config();

export const createQualification = async (req, res, next) => {
  try {
    const { qualification, value, registrationFees } = req.body;

    const schema = Joi.object({
      qualification: Joi.string()
        .min(2)
        .required(),
      value: Joi.string()
        .min(1)
        .required(),
      registrationFees: Joi.string()
        .min(3)
        .required(),
    });

    let data = {
      qualification,
      value,
      registrationFees,
    };
    const { error, values } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    data = await qualificationModel.create({
      qualification,
      value,
      registrationFees,
    });
    return res.status(200).send({ data: data, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getQualification = async (req, res, next) => {
  try {
    const data = await qualificationModel.find({});
    return res.status(200).send({ data: data, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateQualification = async (req, res, next) => {
  try {
    const { qualificationId } = req.params;
    const { qualification, value, registrationFees } = req.body;
    const schema = Joi.object({
      qualificationId: Joi.string().required(),
      qualification: Joi.string().min(2),
      value: Joi.string().min(3),
      registrationFees: Joi.string().min(3),
    });

    let data = {
      qualificationId,
      qualification,
      value,
      registrationFees,
    };
    const { error, values } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }
    const updateData = { qualification, value, registrationFees };
    const updatedQualification = await qualificationModel.findOneAndUpdate(
      { _id: qualificationId },
      updateData,
      { new: true }
    );
    return res.status(200).send({ data: data, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deleteQualification = async (req, res, next) => {
  try {
    const { qualificationId } = req.params;
    if (!qualificationId) {
      return res.status(400).send({ message: "Please send qualificationId" });
    }
    const data = await qualificationModel.findOneAndDelete({
      _id: qualificationId,
    });
    return res.status(200).send({ data: data, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
