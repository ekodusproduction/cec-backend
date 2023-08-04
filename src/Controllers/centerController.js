import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Auth/authentication.js";
import APIFeatures from "../Utils/apiFeatures.js";
import fs from "fs/promises";
import Joi from "joi";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);

export const getCenter = async (req, res, next) => {
  try {
    const { centerId } = req.params;

    const schema = Joi.object({
      centerId: Joi.string().required(),
    });

    let data = { centerId };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const center = await centerModel
      .findById(centerId)
    
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getAllCenter = async (req, res, next) => {
  try {
    const center = await centerModel.find({ isActive: true });
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getAllInactiveCenter = async (req, res, next) => {
  try {
    const center = await centerModel.find({ isActive: false });
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const createcenter = async (req, res, next) => {
  try {
    let {
      firmName,
      dateofReg,
      firmType,
      address,
      landmark,
      pinCode,
      district,
      state,
      alternateNumber,
      whatsApp,
      email,
      landline,
      whatsAppCenterAdmin,
    } = req.body;
    const schema = Joi.object({
      firmName: Joi.string().required(),
      dateofReg: Joi.number().required(),
      firmType: Joi.string().required(),
      address: Joi.string().required(),
      landmark: Joi.string().required(),
      pinCode: Joi.string().required(),
      district: Joi.string().required(),
      state: Joi.string().required(),
      alternateNumber: Joi.string().required(),
      whatsApp: Joi.string().required(),
      email: Joi.string().required(),
      whatsAppCenterAdmin: Joi.string().required(),
    });
    dateofReg = new Date(dateofReg);

    let data = {
      firmName,
      dateofReg,
      firmType,
      address,
      landmark,
      pinCode,
      district,
      state,
      alternateNumber,
      whatsApp,
      email,
      landline,
      whatsAppCenterAdmin,
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    if (!whatsAppCenterAdmin) {
      return res
        .status(400)
        .send({ data: { message: "provide whatsapp" }, status: "fail" });
    }

    const count = await centerModel.countDocuments();
    data["centerId"] = `${(count + 1).toString().padStart(3, "0")}`;
    data["headOfInstitute"] = req.id;
    const center = await centerModel.create(data);
    const user = await centerAdminModel.findOneAndUpdate(
      {
        whatsApp: whatsAppCenterAdmin,
      },
      { $addToSet: { centers: center._id } }
    );

    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updatecenter = async (req, res, next) => {
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

    const dynamicUpdate = { [updateField]: updateValue };
    if (updateField == "courses" || updateField == "categories") {
      const update = await centerModel.findByIdAndUpdate(
        { _id: id },
        { $addToSet: dynamicUpdate },
        { new: true }
      );
      return res.status(200).send({ data: update, status: "ok" });
    } else {
      const update = await centerModel.findByIdAndUpdate(
        { _id: id },
        dynamicUpdate,
        { new: true }
      );
      return res.status(200).send({ data: update, status: "ok" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deletecenter = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const centerId = req.query;
    const schema = Joi.object({
      centerId: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    let data = { centerId, email, password };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const user = await superAdminModel.findById({ _id: req.id });

    if (
      !(email == user.email && (await bcrypt.compare(password, user.password)))
    ) {
      return res.status(400).send({
        message: "please enter correct password or email",
        status: "ok",
      });
    }
    const userdeleted = await centerModel.updateOne(
      { _id: centerId.centerId },
      { $set: { isActive: false } },
      { new: true }
    );

    return res.status(200).send({ data: userdeleted, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
