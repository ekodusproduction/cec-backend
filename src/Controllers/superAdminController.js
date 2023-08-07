import bcrypt from "bcrypt";
import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Joi from "joi";
import { sendMessage } from "../Airtel/airtel.js";
import { generateToken } from "../Auth/authentication.js";
import {superAdminModel} from "../server.js";
import {centerModel} from "../server.js";
import {centerAdminModel} from "../server.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);

export const createSuperAdmin = async (req, res, next) => {
  try {
    const baseUrl = `139.59.83.187`;

    const schema = Joi.object({
      firstName: Joi.string()
        .min(3)
        .max(30)
        .required(),
      lastName: Joi.string()
        .min(3)
        .max(30)
        .required(),
      mobile: Joi.number().required(),
      email: Joi.string()
        .min(11)
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
    });

    const { firstName, lastName, mobile, email, password } = req.body;
    let data = { firstName, lastName, mobile, email, password };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }
    const file = req.files[0];
    if (!file) {
      return res
        .status(400)
        .send({ message: "Invalid request. Send profile pic", status: "fail" });
    }
    const imgBuffer = Buffer.from(file.buffer, "utf-8");
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(password, salt);
    data = {
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

    await fs.writeFile(
      join(
        __dirname +
          `/../../public/superadmin/${mobile.slice(-6)}${file.originalname}`
      ),
      imgBuffer,
      { flag: "a" },
      "utf-8"
    );

    const user = await superAdminModel.create(data);
    if (user == null) {
      return res
        .status(400)
        .send({ message: "failed to create superadmin", status: "fail" });
    }
    user.password = null;
    const profilePic = `${baseUrl}/public/superadmin/${mobile.slice(-6)}${
      file.originalname
    }`;
    const uploadPic = await superAdminModel.findByIdAndUpdate(
      { _id: user._id },
      { $set: { profilePic: profilePic } }
    );

    return res.status(201).send({
      data: { message: "superadmin created successfully" },
      status: "ok",
    });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const loginSuperAdmin = async (req, res, next) => {
  try {
    const { whatsApp, password } = req.body;
    const schema = Joi.object({
      whatsApp: Joi.number().required(),
      password: Joi.string()
        .min(6)
        .required(),
    });

    let data = { whatsApp, password };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const user = await superAdminModel.findOne({ mobile: whatsApp });
    if (user == null) {
      return res.status(400).send({
        data: { message: "email doesnt exist. Please register" },
        status: "fail",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send({
        data: { message: "Incorrect password. Please try again" },
        status: "fail",
      });
    }

    data = {
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
      email: user.email,
    };
    data.password = null;
    const token = generateToken(user._id);

    return res.status(200).send({ data: data, token: token, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const schema = Joi.object({
      mobile: Joi.number().required(),
    });
    let data = { mobile };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }
    const text = `${Math.random * 1000}`;
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

    const schema = Joi.object({
      otp: Joi.number().required(),
      mobile: Joi.number().required(),
    });

    let data = { mobile, otp };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const centerAdmin = await centerAdminModel.findOne({ mobile });
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
    const { mobile, newPassword, otp } = req.body;

    const schema = Joi.object({
      otp: Joi.number().required(),
      mobile: Joi.number()
        .min(10)
        .max(10)
        .required(),
      newPassword: Joi.number()
        .min(6)
        .required(),
    });

    let data = { mobile, otp, newPassword };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const user = await superAdminModel.findOne({ email: email });
    if (user == null) {
      return res.status(400).send({
        data: { message: "email doesnt exist. Please register" },
        status: "fail",
      });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(newPassword, salt);

    data = await superAdminModel.findOneAndUpdate(
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

    const schema = Joi.object({
      id: Joi.string().required(),
    });

    let data = { id };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const user = await superAdminModel.findById(id).select({ password: 0 });

    return res.status(200).send({ data: user, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateSuperAdmin = async (req, res, next) => {
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

    const file = req.files[0];

    const imgBuffer = Buffer.from(file.buffer, "utf-8");
    const user = await superAdminModel.findById(req.id);
    const previousImage = await fs.writeFile(
      appDir + `../../${user.profilePic}`,
      imgBuffer,
      "utf-8"
    );
    const profilePic = `${user.profilePic}`;
    const updateObject = { [updateField]: updateValue };
    const userupdate = await superAdminModel.updateOne(
      { _id: req.id },
      { $set: updateObject },
      { new: true }
    );
    return res.status(200).send({ data: userupdate, status: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err, status: "fail" });
  }
};

export const deleteSuperAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    let data = { email, password };
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
