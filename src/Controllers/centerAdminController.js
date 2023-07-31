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
import sendMessage from "../Twilio/twilio.js";

export const loginCenteradmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(password);
    const centerAdmin = await centerAdminModel.findOne({email:email}).populate("centers");
    console.log("hi", centerAdmin);
    const isCorrectPassword = await bcrypt.compare(password, centerAdmin.password);
    const token = generateToken(centerAdmin._id);
    centerAdmin.password = null;
    return res
      .status(200)
      .send({ data: centerAdmin, token: token, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const createcenterAdmin = async (req, res, next) => {
  try {
    const baseUrl = process.env.baseUrl;
    const {
      nameHoi,
      alternateNumber,
      email,
      address,
      landmark,
      pinCode,
      state,
      district,
      password,
      whatsApp,
      houseNumber,
    } = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const data = {
      nameHoi,
      alternateNumber,
      email,
      address,
      landmark,
      houseNumber,
      pinCode,
      state,
      district,
      whatsApp,
      password: encryptedPassword,
    };
    let user = await centerAdminModel.create(data);
    user.password = null;
    const text = `centerAdmin created successfully. please login using your email ${email} and password ${password}`;
    // sendMessage(text, whatsApp);
    return res.status(200).send({ data: user, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getcenterAdmin = async (req, res, next) => {
  try {
    const user = await centerAdminModel.findOne({ _id: req.id });
    return res.status(200).send({ data: userdeleted, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updatecenterAdmin = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const { id, updateField, updateValue } = requestBody;
    const update = await centerAdminModel.updateOne(
      { _id: id },
      { $set: { updateField, updateValue } }
    );
    const file = req.files[0];

    if (file) {
      const imgBuffer = Buffer.from(file.buffer, "utf-8");
      user = await centerAdminModel.findById(req.id);
      const previousImage = await fs.writeFile(
        appDir + `../../${user.profilePic}`,
        imgBuffer,
        "utf-8"
      );
      const profilePic = `${user.profilePic}`;
      const userupdate = await centerAdminModel.updateOne(
        { _id: req.id },
        { $set: { profilePic: profilePic } }
      );
    }
    return res.status(200).send({ data: user, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deletecenterAdmin = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const { id, password } = requestBody;
    const user = await superAdminModel.findById(req.id);
    if (user.password != password) {
      return res.status(400).send({
        data: { message: "please enter correct password" },
        status: "fail",
      });
    }
    const userdeleted = await centerAdminModel.updateOne(
      { _id: id },
      { $set: { isActive: false } }
    );
    return res
      .status(200)
      .send({ data: { message: "user deleted" }, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
