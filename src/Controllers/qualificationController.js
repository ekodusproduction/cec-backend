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
import { sendMessage } from "../Twilio/twilio.js";
import { generateToken } from "../Auth/authentication.js";
import upload from "../app.js";
import qualificationModel from "../Models/qualificationMode.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);
dotenv.config();

export const createQualification = async (req, res, next) => {
  try {
    const { qualification, value } = req.body;
    const data = await qualificationModel.create({ qualification, value });
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
    const { qualification, value } = req.body;
    const data = await qualificationModel.findOneAndUpdate(
      { _id: qualificationId.qualificationId },
      {
        qualification,
        value,
      }
    );
    return res.status(200).send({ data: data, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deleteQualification = async (req, res, next) => {
  try {
    const { qualificationId } = req.query;
    const data = await qualificationModel.findOneAndDelete({
      _id: qualificationId,
    });
    return res.status(200).send({ data: data, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
