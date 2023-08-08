import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import bcrypt from "bcrypt";
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

    const center = await centerModel.findById(centerId);

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

export const getAllCentersUnderAdmin = async (req, res, next) => {
  try {
    const { centeradminId } = req.params;
    if (!centeradminId) {
      return res
        .status(400)
        .send({ message: "invalid request", status: "fail" });
    }
    const center = await centerModel.find({
      isActive: true,
      headOfInstitute: centeradminId,
    });
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

    let data = {
      centerName,
      centerCode,
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
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    if (!adminMobile) {
      return res
        .status(400)
        .send({ data: { message: "provide admin loginId" }, status: "fail" });
    }

    const convertToDate = (DOB) => {
      const [year, day, month] = DOB.split("-").map(Number);
      return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date, so subtract 1 from the month value.
    };

    data.dateofReg = convertToDate(dateofReg);
    const count = await centerModel.countDocuments();
    const centerAdmin = await centerAdminModel.findOne({
      mobile: adminMobile,
    });
    if (!centerAdmin) {
      return res.status(200).send({
        data: "Invalid request. Please provide valid whatsapp number",
        status: "fail",
      });
    }
    data["centerId"] = `${(count + 1).toString().padStart(3, "0")}`;
    data["headOfInstitute"] = centerAdmin._id;
    const center = await centerModel.create(data);
    const user = await centerAdminModel.findOneAndUpdate(
      {
        whatsApp: whatsAppCenterAdmin,
      },
      { $addToSet: { centers: center._id } }
    );

    return res.status(200).send({ data: center, status: "ok" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: err, status: "fail" });
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
    res.status(500).send({ message: err.message, status: "fail" });
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
    res.status(500).send({ message: err.message, status: "fail" });
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
    res.status(500).send({ message: err.message, status: "fail" });
  }
};
