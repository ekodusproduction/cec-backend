import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { generateToken } from "../Auth/generateJwt.js";
import { handleErrors } from "../Utils/errorHandler.js";
import { pinCodeValidator, mobileValidator } from "../Utils/validator.js";
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
      .populate({ path: "headOfInstitute", model: centerAdminModel });

    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const loginCenter = async (req, res, next) => {
  try {
    const { centerName, centerCode, password } = req.body;

    const schema = Joi.object({
      centerName: Joi.string().required(),
      centerCode: Joi.string().required(),
      password: Joi.string().required(),
    });

    let data = { centerName, centerCode, password };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }
    const centerNameExist = await centerModel.findOne({
      centerName: centerName,
    });

    if (!centerNameExist) {
      return res.status(400).send({
        message: "Wrong center name. Please provide correct center name.",
        status: "fail",
      });
    }

    let centerCodeExist = await centerModel.findOne({
      centerCode: centerCode,
    });

    if (!centerCodeExist) {
      return res.status(400).send({
        message: "Wrong center code. Please provide correct center code",
        status: "fail",
      });
    }

    if (centerCodeExist.centerName != centerName) {
      return res.status(400).send({
        message: "center code doesnt belong to center name",
        status: "fail",
      });
    }

    const centerAdmin = await centerAdminModel.findById(
      centerCodeExist.headOfInstitute
    );
    const isPasswordCorrect = await bcrypt.compare(
      password,
      centerAdmin.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).send({
        message: "Incorrect password",
        status: "fail",
      });
    }

    const token = generateToken(centerCodeExist._id);
    return res
      .status(200)
      .send({ data: centerCodeExist, token: token, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getAllCenter = async (req, res, next) => {
  try {
    const center = await centerModel
      .find({ isActive: true })
      .select({ centerCode: 1, centerName: 1, dateofReg: 1, totalStudent: 1 })
      .populate({
        path: "headOfInstitute",
        model: centerAdminModel,
        select: "adminName",
      })
      .sort({ createdAt: 1 });
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getAllInactiveCenter = async (req, res, next) => {
  try {
    const center = await centerModel
      .find({ isActive: false })
      .sort({ createdAt: 1 });
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getAllCentersUnderAdmin = async (req, res, next) => {
  try {
    const { centeradminId } = req.params;
    if (!centeradminId) {
      return res.status(400).send({
        message: "invalid request. Please provide centeradminId.",
        status: "fail",
      });
    }
    const center = await centerModel
      .find({
        isActive: true,
        headOfInstitute: centeradminId,
      })
      .sort({ createdAt: 1 });
    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
export const createcenter = async (req, res, next) => {
  try {
    let {
      centerName,
      dateofReg,
      address,
      landmark,
      pinCode,
      district,
      state,
      alternateNumber,
      whatsApp,
      email,
      adminMobile,
      centerCode,
    } = req.body;
    const schema = Joi.object({
      centerName: Joi.string().required(),
      centerCode: Joi.string().required(),
      dateofReg: Joi.string().required(),
      address: Joi.string().required(),
      landmark: Joi.string().required(),
      pinCode: Joi.number().required(),
      district: Joi.string().required(),
      state: Joi.string().required(),
      alternateNumber: Joi.number(),
      whatsApp: Joi.number().required(),
      email: Joi.string().required(),
      adminMobile: Joi.number().required(),
    });
    if (alternateNumber == "") {
      alternateNumber = whatsApp;
    }

    let data = {
      centerName,
      dateofReg,
      address,
      landmark,
      pinCode,
      district,
      state,
      alternateNumber,
      whatsApp,
      email,
      adminMobile,
      centerCode,
    };
    centerName = centerName.toUpperCase();
    data.centerName = centerName
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    if (!mobileValidator(whatsApp)) {
      return res
        .status(400)
        .send({ message: "Provide valid center number.", status: 400 });
    }

    if (!pinCodeValidator(pinCode)) {
      return res.status(400).send({
        message: "Provide valid pincode",
        status: 400,
      });
    }
    if (centerCode.length != 3) {
      return res.status(400).send({
        message: "Center code must be 3 letters long.",
        status: 400,
      });
    }


    if (!adminMobile) {
      return res.status(400).send({
        message: "Provide admin loginId/number",
        status: 400,
      });
    }

    if (!mobileValidator(adminMobile)) {
      return res
        .status(400)
        .send({ message: "Invalid registration mobile number", status: 400 });
    }

    const convertToDate = (DOB) => {
      const [year,  month, day] = DOB.split("-").map(Number);
      return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date, so subtract 1 from the month value.
    };
    const centerCodeExist = await centerModel.findOne({ centerCode });
    if (centerCodeExist) {
      return res.status(400).send({
        message: "center Code exist. Please provide another center code",
        status: 400,
      });
    }

    const centerEmailExist = await centerModel.findOne({ email });
    if (centerEmailExist) {
      return res.status(400).send({
        message: "center email exist. Please provide another email.",
        status: 400,
      });
    }

    const centerNameExist = await centerModel.findOne({ centerName });
    if (centerNameExist) {
      return res.status(400).send({
        message: "Center name exist. Please provide another center name",
        status: 400,
      });
    }

    data.dateofReg = convertToDate(dateofReg);
    // const count = await centerModel.countDocuments();
    const centerAdmin = await centerAdminModel.findOne({
      mobile: adminMobile,
    });
    if (!centerAdmin) {
      return res.status(400).send({
        message:
          "Centeradmin registration number is not valid. Provide a valid number",
        status: 400,
      });
    }
    // data["centerId"] = `${(count + 1).toString().padStart(3, "0")}`;
    data["headOfInstitute"] = centerAdmin._id;
    const center = await centerModel.create(data);
    const user = await centerAdminModel.findOneAndUpdate(
      {
        mobile: adminMobile,
      },
      { $addToSet: { centers: center._id } }
    );

    return res.status(201).send({ data: center, status: 201 });
  } catch (err) {
    await handleErrors(err, req, res, next)
  }
};

export const updateCenter = async (req, res, next) => {
  try {
    const updateObj = req.body;
    const { centerId } = req.params;

    if (!centerId) {
      return res.status(400).json({
        message: "Invalid request. Please provide valid centerId.",
        status: 404,
      });
    }

    const center = await centerModel.findById(centerId);

    if (!center) {
      return res.status(404).json({
        message: "Center not found.  Please provide valid centerId",
        status: 404,
      });
    }

    if (Object.keys(updateObj).length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid request. Send update object", status: 400 });
    }

    const updatedCenter = await centerModel.findByIdAndUpdate(
      centerId,
      { $set: updateObj },
      { new: true }
    );

    return res.status(200).json({ data: updatedCenter, status: 200 });
  } catch (err) {
    await handleErrors(err, req, res, next)
  }
};

export const deletecenter = async (req, res, next) => {
  try {
    // const { email, password } = req.body;
    // const centerId = req.query;
    // const schema = Joi.object({
    //   centerId: Joi.string().required(),
    //   email: Joi.string().required(),
    //   password: Joi.string().required(),
    // });

    // let data = { centerId, email, password };
    // const { error, value } = schema.validate(data);
    // if (error) {
    //   return res
    //     .status(400)
    //     .send({ message: error.details[0].message, status: "fail" });
    // }

    const user = await superAdminModel.findById({ _id: req.id });

    if (
      !(email == user.email && (await bcrypt.compare(password, user.password)))
    ) {
      return res.status(400).send({
        message: "Please enter correct password or email",
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
    await handleErrors(err, req, res, next)
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { courseId, centerId, studentId } = req.body;

    const schema = Joi.object({
      courseId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      centerId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      studentId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
    });

    let data = { courseId, centerId, studentId };
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
        .send({ message: "Center admin not found", status: "fail" });
    }

    if (!center.cart) {
      center.cart = data;
    } else {
      center.cart.courseId.push(courseId);
    }

    await center.save();

    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    await handleErrors(err, req, res, next)
  }
};

export const getCart = async (req, res, next) => {
  try {
    const { centerId } = req.body;

    const schema = Joi.object({
      centerId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
    });

    let data = { centerId };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const center = await centerModel.findById(req.id).populate("cart");

    return res.status(200).send({ data: center.cart, status: "ok" });
  } catch (err) {
    await handleErrors(err, req, res, next)
  }
};

export const deleteCart = async (req, res, next) => {
  try {
    const { centerId } = req.body;

    const schema = Joi.object({
      centerId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
    });

    let data = { centerId };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const center = await centerModel.findById(req.id);
    center.cart = null;
    await center.save();

    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    await handleErrors(err, req, res, next)
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { centerAdminId, newPassword, confirmPassword } = req.body;
    const schema = Joi.object({
      centerAdminId: Joi.string().required(),
      newPassword: Joi.string()
        .min(8)
        .required(),
      confirmPassword: Joi.string()
        .min(8)
        .required(),
    });

    let data = { centerAdminId, newPassword, confirmPassword };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: 400 });
    }
    if (newPassword != confirmPassword) {
      return res.status(400).send({
        message:
          "Invalid request. Confirm password and new password should be same.",
        status: 400,
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const centerAdmin = await centerAdminModel.findByIdAndUpdate(
      centerAdminId,
      { password: encryptedPassword },
      { new: true }
    );
    console.log(centerAdmin);
    return res.status(200).send({ data: centerAdmin, status: 200 });
  } catch (err) {
    await handleErrors(err, req, res, next)
  }
};
