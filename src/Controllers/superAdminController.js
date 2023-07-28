import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import multer from "multer";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { sendMessage } from "../Twilio/twilio.js";
import { generateToken } from "../Auth/authentication.js";
import upload from "../app.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);

export const createSuperAdmin = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const { firstName, lastName, mobile, email, password } = requestBody;
    const file = req.files[0];
    const imgBuffer = Buffer.from(file.buffer, "utf-8");
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const data = {
      firstName,
      lastName,
      mobile,
      email,
      password: encryptedPassword,
    };
    const userExist = await superAdminModel.findOneAndUpdate(
      { email: email },
      { $set: { isActive: true } }
    );
    if (userExist) {
      return res
        .status(200)
        .send({ data: { message: "superadmin exist already" }, status: "ok" });
    }
    const user = await superAdminModel.create(data);
    if (user == null) {
      return res
        .status(400)
        .send({ message: "failed to create superadmin", status: "fail" });
    }
    user.password = null;
    const profilePic = `/public/superadmin/${user.id.slice(-6)}${
      file.originalname
    }`;
    const uploadPic = await superAdminModel.findByIdAndUpdate(
      { _id: user._id },
      { $set: { profilePic: profilePic } }
    );
    await fs.writeFile(
      appDir +
        `../../public/superadmin/${user.id.slice(-6)}${file.originalname}`,
      imgBuffer,
      "utf-8"
    );

    return res
      .status(201)
      .send({
        data: { message: "superadmin created successfully" },
        status: "ok",
      });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const loginSuperAdmin = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const { email, password } = requestBody;
    const user = await superAdminModel.findOne({ email: email });
    if (user == null) {
      return res
        .status(400)
        .send({
          data: { message: "email doesnt exist. Please register" },
          status: "fail",
        });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .send({
          data: { message: "Incorrect password. Please try again" },
          status: "fail",
        });
    }
    const data = {
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
    };
    const token = generateToken(user._id);

    return res.status(200).send({ data: data, token: token, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const text = `${Math.random * 10000}`;
    sendMessage(text, mobile);
    const centerAdmin = await centerAdminModel.findOneAndUpdate(
      { mobile },
      { $set: { otp: text } }
    );
    return res
      .status(200)
      .send({ data: { message: "otp sent succesfully" }, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
export const checkOtp = async (req, res, next) => {
  try {
    const { otp, mobile } = req.body;
    const centerAdmin = await centerAdminModel.findOne(mobile);
    if (otp != centerAdmin.otp) {
      return res
        .status(403)
        .send({ data: { message: "incorrect otp " }, status: "fail" });
    }

    return res
      .status(200)
      .send({ data: { message: "otp verified" }, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const { email, newPassword } = requestBody;
    const user = await superAdminModel.findOne({ email: email });
    if (user == null) {
      return res
        .status(400)
        .send({
          data: { message: "email doesnt exist. Please register" },
          status: "fail",
        });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(newPassword, salt);

    const data = await superAdminModel.findOneAndUpdate(
      { email },
      { encryptedPassword }
    );
    return res
      .status(200)
      .send({ data: { message: "password updated" }, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getSuperAdmin = async (req, res, next) => {
  try {
    const id = req.id;
    const user = await superAdminModel.findById(id).select({ password: 0 });

    return res.status(200).send({ data: user, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateSuperAdmin = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const file = req.files[0];

    const imgBuffer = Buffer.from(file.buffer, "utf-8");
    const user = await superAdminModel.findById(req.id);
    const previousImage = await fs.writeFile(
      appDir + `../../${user.profilePic}`,
      imgBuffer,
      "utf-8"
    );
    const profilePic = `${user.profilePic}`;
    const userupdate = await superAdminModel.updateOne(
      { _id: req.id },
      { $set: { profilePic: profilePic } }
    );
    return res.status(200).send({ data: userupdate, status: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err, status: "fail" });
  }
};

export const deleteSuperAdmin = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const { email, password } = requestBody;
    const user = await superAdminModel.findById({ _id: req.id });
    if (!(email == user.email && bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .send({ message: "please enter correct password and email" });
    }

    fs.unlink(appDir + `../..` + user.profilePic);
    const userdeleted = await superAdminModel.deleteOne({ _id: req.id });
    return res.status(200).send({ data: userdeleted, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
