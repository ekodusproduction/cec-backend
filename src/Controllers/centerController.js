import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Auth/authentication.js";
import APIFeatures from "../Utils/apiFeatures.js";
import fs from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);

export const getCenter = async (req, res, next) => {
  try {
    const {cadmin} = req.params;
    console.log(cadmin)
    const center = await centerAdminModel
      .findById(cadmin)
      .populate("centers").select("centers");
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getAllCenter = async (req, res, next) => {
  try {
    const centerId = req.query;
    if (centerId.centerId) {
      const center = await centerModel
        .find({ centerId: centerId.centerId, isActive: true })
        .populate("headOfInstitute");
      return res.status(200).send({ data: center, status: "ok" });
    }
    const center = await centerModel.find({});
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
    } = req.body;
    dateofReg = new Date(dateofReg)
    console.log(dateofReg)
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
    };
    const { whatsAppCenterAdmin } = req.body;
    if (!whatsAppCenterAdmin) {
      return res
        .status(400)
        .send({ data: { message: "provide whatsapp" }, status: "fail" });
    }
    const cadmin = await centerAdminModel.findById(req.id);
    const count = await centerModel.countDocuments();
    data["centerId"] = `${(count+1).toString().padStart(3,"0")}`;
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
    const requestBody = req.body;
    const { id, updateField, updateValue } = requestBody;
    console.log(updateField, updateValue);
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
    const requestBody = req.body;
    const centerId = req.query;
    const { email, password } = requestBody;
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

    return res.status(200).send({ data: user, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
