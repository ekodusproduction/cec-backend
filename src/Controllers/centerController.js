import superAdminModel from "../Models/superAdminModel.js";
import centerModel from "../Models/centerModel.js";
import centerAdminModel from "../Models/centerAdminModel.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { generateToken } from "../Auth/authentication.js";
import { pinCodeValidator , mobileValidator} from "../Utils/validator.js";
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
      return res
        .status(400)
        .send({ message: "Wrong center name", status: "fail" });
    }

    let centerCodeExist = await centerModel.findOne({
      centerCode: centerCode,
    });

    if (!centerCodeExist) {
      return res
        .status(400)
        .send({ message: "Wrong center code", status: "fail" });
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
      .send({ data:  centerCodeExist , token: token, status: "ok" });
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
      });
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
      centerCode: Joi.number().required(),
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
      centerCode,
      dateofReg,
      address,
      landmark,
      pinCode,
      district,
      state,
      whatsApp,
      email,
      adminMobile,
      alternateNumber,
    };
    console.log("datadfatttt",data)
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    console.log("sssssssssssssssss",data)

    if (!mobileValidator(whatsApp)) {
      return res
        .status(400)
        .send({ message: "Invalid whatsApp number", status: 400 });
    }
    console.log("mmmmmmmmmmmm")

    if (!pinCodeValidator(pinCode)) {
      return res.status(400).send({
        message: "provide valid pincode",
        status: 400,
      });
    }
    console.log("pppppppppp")

    if (!adminMobile) {
      return res.status(400).send({
        message: "provide admin loginId/number",
        status: 400,
      });
    }
    console.log("aaaaaaaaaaaaaaa")

    if (!mobileValidator(adminMobile)) {
      return res
        .status(400)
        .send({ message: "Invalid adminMobile number", status: 400 });
    }
    console.log("amamamamama")

    const convertToDate = (DOB) => {
      const [year, day, month] = DOB.split("-").map(Number);
      return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date, so subtract 1 from the month value.
    };
    console.log("dbodbodobd")
    const centerCodeExist = await centerModel.findOne({centerCode});
    if(centerCodeExist){
      return res
      .status(400)
      .send({ message: "center Code exist. Please provide another center code", status: 400 });
    }

    const centerNameExist = await centerModel.findOne({centerName});
    if(centerNameExist){
      return res
      .status(400)
      .send({ message: "Center name exist. Please provide another center name", status: 400 });
    }
    data.dateofReg = convertToDate(dateofReg);
    // const count = await centerModel.countDocuments();
    const centerAdmin = await centerAdminModel.findOne({
      mobile: adminMobile,
    });
    if (!centerAdmin) {
      return res.status(400).send({
        message: "Invalid request. Please provide valid mobile number",
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
    return res.status(500).send({ message: err, status: "fail" });
  }
};

export const updatecenter = async (req, res, next) => {
  try {
    const updateObj = req.body;
    const centerId = req.params;
    if (!centerId) {
      return res
        .status(404)
        .send({ message: "Center not found", status: 404 });
    }
    const center = await centerModel.findById(centerId);

    if (!(Object(updateObj).keys().length > 0)) {
      return res
        .status(400)
        .send({ message: "Invalid request . Send update object", status: 400 });
    }


    const updateCenter = await studentModel.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true }
    );

    return res.status(200).send({ data: updateCenter, status: 200 });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: 500 });
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


export const changePassword = async (req, res, next) => {
  try {
    const {  } = req.body;

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