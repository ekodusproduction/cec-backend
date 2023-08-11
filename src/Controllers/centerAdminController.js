import superAdminModel from "../Models/superAdminModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../Auth/authentication.js";
import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Joi from "joi";
import { sendMessage } from "../Airtel/airtel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);
var baseUrl = `139.59.83.187`;

// export const loginCenteradmin = async (req, res, next) => {
//   try {
//     const { mobile, password } = req.body;

//     const schema = Joi.object({
//       mobile: Joi.string().required(),
//       password: Joi.string().required(),
//     });

//     let data = { mobile, password };
//     const { error, value } = schema.validate(data);
//     if (error) {
//       return res
//         .status(400)
//         .send({ message: error.details[0].message, status: "fail" });
//     }

//     const centerAdmin = await centerAdminModel
//       .findOne({ mobile })
//       .populate("centers");

//     if (centerAdmin == null) {
//       return res.status(400).send({
//         data: { message: "whatsApp doesnt exist. Please register" },
//         status: "fail",
//       });
//     }

//     const isCorrectPassword = await bcrypt.compare(
//       password,
//       centerAdmin.password
//     );

//     if (!isCorrectPassword) {
//       return res.status(400).send({
//         data: { message: "Incorrect password. Please try again" },
//         status: "fail",
//       });
//     }
//     const token = generateToken(centerAdmin._id);
//     centerAdmin.password = null;

//     return res
//       .status(200)
//       .send({ data: centerAdmin, token: token, status: "ok" });
//   } catch (err) {
//     return res.status(500).send({ message: err.message, status: "fail" });
//   }
// };

export const createcenterAdmin = async (req, res, next) => {
  try {
    let {
      adminName,
      alternateNumber,
      email,
      address,
      pinCode,
      state,
      district,
      password,
      mobile,
    } = req.body;
    if (alternateNumber == "") {
      alternateNumber = mobile;
    }
    const schema = Joi.object({
      adminName: Joi.string().required(),
      alternateNumber: Joi.string(),
      email: Joi.string().required(),
      address: Joi.string().required(),
      pinCode: Joi.string().required(),
      state: Joi.string().required(),
      district: Joi.string().required(),
      password: Joi.string().required(),
      mobile: Joi.string().required(),
    });

    let data = {
      adminName,
      email,
      address,
      alternateNumber,
      pinCode,
      state,
      district,
      password,
      mobile,
    };

    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const encryptedPassword = await bcrypt.hash(password, salt);
    data = {
      adminName,
      alternateNumber,
      email,
      address,
      pinCode,
      state,
      district,
      mobile,
      password: encryptedPassword,
    };
    let user = await centerAdminModel.create(data);
    user.password = null;
    const text = `centerAdmin created successfully. please login using your email ${email} and password ${password}`;
    // sendMessage(text, mobile);
    return res.status(200).send({ data: user, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err, status: "fail" });
  }
};

export const getcenterAdmin = async (req, res, next) => {
  try {
    const user = await centerAdminModel.findById(req.id);
    return res.status(200).send({ data: user, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getAllcenterAdmin = async (req, res, next) => {
  try {
    const user = await centerAdminModel.find({ isActive: true });
    return res.status(200).send({ data: user, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getAllInactiveCenterAdmin = async (req, res, next) => {
  try {
    const user = await centerAdminModel.find({ isActive: false });
    return res.status(200).send({ data: user, status: "ok" });
  } catch (err) {
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updatecenterAdmin = async (req, res, next) => {
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

    const updateObject = { [updateField]: updateValue };
    const updatedAdmin = await centerAdminModel.findByIdAndUpdate(
      id,
      updateObject,
      { new: true }
    );

    return res.status(200).send({ data: updatedAdmin, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const fileUpload = async (req, res, next) => {
  try {
    const file = req.files[0];
    if (!file) {
      return res
        .status(400)
        .send({ message: "invalid request. send file", status: "fail" });
    }

    const imgBuffer = Buffer.from(file.buffer, "utf-8");
    const user = await centerAdminModel.findById(req.id);
    if (!user) {
      return res
        .status(400)
        .send({ message: "invalid user id in token. login again" });
    }

    await fs.writeFile(
      join(
        __dirname +
          `/../../public/centeradmin/${user.whatsApp.toString().slice(-6)}${
            file.fieldname
          }.${file.mimetype.split("/")[1]}`
      ),
      imgBuffer,
      "utf-8"
    );

    const profilePic = `${baseUrl}/public/centeradmin/${user.whatsApp
      .toString()
      .slice(-6)}${file.fieldname}.${file.mimetype.split("/")[1]}`;
    const userupdate = await centerAdminModel.updateOne(
      { _id: req.id },
      { profilePic: profilePic }
    );

    return res.status(200).send({ data: userupdate, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deletecenterAdmin = async (req, res, next) => {
  try {
    const { id, password } = req.body;

    const schema = Joi.object({
      id: Joi.string().required(),
      password: Joi.string().required(),
    });

    let data = { id, password };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const user = await superAdminModel.findById(req.id);

    if (await bcrypt.compare(password, user.password)) {
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
