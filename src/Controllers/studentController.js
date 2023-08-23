import centerModel from "../Models/centerModel.js";
import studentModel from "../Models/studentModel.js";
import fs from "fs/promises";
import APIFeatures from "../Utils/apiFeatures.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Joi from "joi";
import { sendMessage } from "../Airtel/airtel.js";
import courseModel from "../Models/courseModel.js";
import qualificationModel from "../Models/qualificationModel.js";
import superAdminModel from "../Models/superAdminModel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);
const baseUrl = `139.59.83.187`;

const generateRollNumber = async (centerId) => {
  const regCenter = await centerModel.findById(centerId);
  const count = await studentModel.countDocuments({
    centerId: centerId,
  });

  // Get the current month and year
  const currentDate = new Date();
  const currentYear = currentDate
    .getFullYear()
    .toString()
    .slice(-2);
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  const centerCodePadded = regCenter.centerCode.toString().padStart(3, "0");

  const rollNumber = `${(count + 1)
    .toString()
    .padStart(3, "0")}${currentMonth}${currentYear}${centerCodePadded}`;
  return rollNumber;
};

export const studentRegister = async (req, res, next) => {
  try {
    let {
      firstName,
      lastName,
      DOB,
      mobile,
      qualification,
      pinCodePresent,
      presentAddress,
      cityPresent,
      statePresent,
      permanentAddress,
      statePermanent,
      cityPermanent,
      pinCodePermanent,
      centerCode,
      courses,
    } = req.body;
    console.log(req.body);
    centerCode = centerCode * 1;
    let schema = Joi.object({
      firstName: Joi.string()
        .min(3)
        .required(),
      lastName: Joi.string()
        .min(3)
        .required(),
      DOB: Joi.string().required(),
      mobile: Joi.number().required(),
      qualification: Joi.string()
        .min(3)
        .required(),
      pinCodePresent: Joi.number()
        .min(100000)
        .max(999999)
        .required(),
      presentAddress: Joi.string()
        .min(1)
        .max(100)
        .required(),
      permanentAddress: Joi.string()
        .min(1)
        .max(100)
        .required(),
      cityPresent: Joi.string()
        .min(3)
        .required(),
      statePresent: Joi.string()
        .min(1)
        .required(),
      cityPermanent: Joi.string()
        .min(3)
        .required(),
      statePermanent: Joi.string()
        .min(1)
        .required(),
      pinCodePermanent: Joi.number()
        .min(100000)
        .max(999999)
        .required(),
      centerCode: Joi.number().required(),
      courses: Joi.array().required(),
    });

    let data = {
      firstName,
      lastName,
      DOB,
      mobile,
      qualification,
      pinCodePresent,
      presentAddress,
      cityPresent,
      statePresent,
      permanentAddress,
      statePermanent,
      cityPermanent,
      pinCodePermanent,
      centerCode,
      courses,
    };
    let { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    let convertToDate = (DOB) => {
      let [year, day, month] = DOB.split("-").map(Number);
      return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date, so subtract 1 from the month value.
    };

    DOB = convertToDate(DOB);

    let center = await centerModel.findOne({ centerCode: centerCode });
    const centerId = center._id;
    if (!center) {
      return res
        .status(404)
        .send({ data: { message: "center not found" }, status: "fail" });
    }
    const rollNumber = await generateRollNumber(centerId);
    const studentData = {
      firstName,
      lastName,
      DOB,
      mobile,
      qualification,
      pinCodePresent,
      presentAddress,
      cityPresent,
      statePresent,
      permanentAddress,
      statePermanent,
      cityPermanent,
      pinCodePermanent,
      centerId,
      rollNumber,
      course: courses,
    };
    let student = await studentModel.create(studentData);
    const centerUpdate = await centerModel.findByIdAndUpdate(
      { _id: centerId },
      { $inc: { totalStudent: 1 } }
    );
    const updateStudent = await studentModel.findByIdAndUpdate(student._id, {
      $addToSet: { course: courses },
    });

    let text = `Student registered succesfully with CEC. To generate rollnumber please pay for the course`;
    // sendMessage(text, mobile);
    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const studentRegisterCenter = async (req, res, next) => {
  try {
    let {
      firstName,
      lastName,
      DOB,
      mobile,
      qualification,
      pinCodePresent,
      presentAddress,
      cityPresent,
      statePresent,
      permanentAddress,
      statePermanent,
      cityPermanent,
      pinCodePermanent,
      courses,
    } = req.body;

    let schema = Joi.object({
      firstName: Joi.string()
        .min(3)
        .required(),
      lastName: Joi.string()
        .min(3)
        .required(),
      DOB: Joi.string().required(),
      mobile: Joi.number().required(),
      qualification: Joi.string()
        .min(3)
        .required(),
      pinCodePresent: Joi.number()
        .min(100000)
        .max(999999)
        .required(),
      presentAddress: Joi.string()
        .min(1)
        .max(100)
        .required(),
      permanentAddress: Joi.string()
        .min(1)
        .max(100)
        .required(),
      cityPresent: Joi.string()
        .min(3)
        .required(),
      statePresent: Joi.string()
        .min(1)
        .required(),
      cityPermanent: Joi.string()
        .min(3)
        .required(),
      statePermanent: Joi.string()
        .min(1)
        .required(),
      pinCodePermanent: Joi.number()
        .min(100000)
        .max(999999)
        .required(),
      courses: Joi.array().required(),
    });

    let data = {
      firstName,
      lastName,
      DOB,
      mobile,
      qualification,
      pinCodePresent,
      presentAddress,
      cityPresent,
      statePresent,
      permanentAddress,
      statePermanent,
      cityPermanent,
      pinCodePermanent,

      courses,
    };
    let { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    let convertToDate = (DOB) => {
      let [year, day, month] = DOB.split("-").map(Number);
      return new Date(year, month - 1, day); // Month is 0-based in JavaScript Date, so subtract 1 from the month value.
    };

    DOB = convertToDate(DOB);

    let center = await centerModel.findById(req.id);
    const centerId = center._id;
    if (!center) {
      return res
        .status(404)
        .send({ data: { message: "center not found" }, status: "fail" });
    }
    const rollNumber = await generateRollNumber(centerId);
    const studentData = {
      firstName,
      lastName,
      DOB,
      mobile,
      qualification,
      pinCodePresent,
      presentAddress,
      cityPresent,
      statePresent,
      permanentAddress,
      statePermanent,
      cityPermanent,
      pinCodePermanent,
      centerId,
      rollNumber,
      course: courses,
    };
    let student = await studentModel.create(studentData);
    const centerUpdate = await centerModel.findByIdAndUpdate(
      { _id: centerId },
      { $inc: { totalStudent: 1 } }
    );
    const updateStudent = await studentModel.findByIdAndUpdate(student._id, {
      $addToSet: { course: courses },
    });

    let text = `Student registered succesfully with CEC. To generate rollnumber please pay for the course`;
    // sendMessage(text, mobile);
    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getallStudentSuper = async (req, res, next) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";

    const students = await studentModel
      .find({
        isActive: true,
      })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate({
        path: "centerId",
        model: centerModel,
        select: { centerName: 1, centerCode: 1 },
      })
      .populate({ path: "course", model: courseModel })
      .populate({ path: "qualification", model: qualificationModel });

    return res.status(200).send({ data: students, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err, status: "fail" });
  }
};

export const getallStudentCenter = async (req, res, next) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    const { centerId } = req.params;

    if (!centerId) {
      return res
        .status(400)
        .send({ message: "invalid request. Send request params" });
    }
    const students = await studentModel
      .find({
        isActive: true,
        centerId: centerId,
      })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate({ path: "course", model: courseModel })
      .populate({ path: "qualification", model: qualificationModel });
    // .populate({ path: "centerId", model: centerModel })
    // .populate({ path: "course", model: courseModel });

    return res.status(200).send({
      data: students,
      status: "ok",
    });
  } catch (err) {
    return res.status(500).send({ message: err, status: "fail" });
  }
};

export const getallInactiveStudent = async (req, res, next) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || "-createdAt";
    const student = await studentModel
      .find({ isActive: false })
      .skip(skip)
      .limit(limit)
      .sort(sort);
    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getStudentByRoll = async (req, res, next) => {
  try {
    let { rollNumber } = req.params;
    rollNumber = rollNumber.toString();
    if (!rollNumber) {
      return res.status(400).send({
        data: { message: "invalid request. please provide student Rollnumber" },
        status: "fail",
      });
    }
    const isSuper = await superAdminModel
      .findById(req.id)
      .select({ firstName: 1 });
    let student;
    if (isSuper) {
      student = await studentModel
        .findOne({
          rollNumber: rollNumber,
        })
        .populate({
          path: "centerId",
          model: centerModel,
          select: { centerName: 1, centerCode: 1 },
        })
        .populate({ path: "course", model: courseModel })
        .populate({ path: "qualification", model: qualificationModel });
    } else {
      student = await studentModel
        .findOne({
          rollNumber: rollNumber,
          centerId: req.id,
        })
        .populate({
          path: "centerId",
          model: centerModel,
          select: { centerName: 1, centerCode: 1 },
        })
        .populate({ path: "course", model: courseModel })
        .populate({ path: "qualification", model: qualificationModel });
    }
    if (!student) {
      return res
        .status(200)
        .send({ message: "No student found", status: "ok" });
    }

    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err, status: "fail" });
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    if (!req.params.studentId) {
      return res.status(400).send({
        data: { message: "invalid request. please provide studentId" },
        status: "fail",
      });
    }

    const student = await studentModel
      .find({ _id: req.params.studentId })
      .populate({ path: "centerId", model: centerModel })
      .populate({ path: "course", model: courseModel })
      .populate({ path: "qualification", model: qualificationModel });

    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const addNewCourse = async (req, res, next) => {
  try {
    const { id, courseId, paymentId } = req.body;

    const schema = Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      courseId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      paymentId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
    });
    let data = {
      id,
      courseId,
      paymentId,
    };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }
    const student = await studentModel.findByIdAndUpdate(
      { _id: id },
      { $addToSet: { course: courseId } },
      { new: true }
    );
    return res.status(200).send({ data: student, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    let updateObj = req.body;
    const { rollNumber } = req.params;
    if (!rollNumber) {
      return res.status(400).send({
        message: "Invalid request. Please provide rollNumber.",
        status: 400,
      });
    }

    const student = await studentModel.findOne({ rollNumber });

    if (!student) {
      return res.status(400).send({
        message: "Invalid request. Please provide valid rollnumber.",
        status: 400,
      });
    }
    if (!(Object.keys(updateObj).length > 0)) {
      return res
        .status(400)
        .send({ message: "Invalid request . Send update object", status: 400 });
    }

    if (req.files && req.files.length > 0) {
      const projectFolder = `/public/student/${student._id}`;
      console.log("update files");
      const folder = join(__dirname, `../../${projectFolder}`);
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const buffer = Buffer.from(file.buffer, "utf-8");
        const fileName = `/${file.fieldname}.${file.mimetype.split("/")[1]}`;
        const fullName = join(folder, `/${fileName}`);
        await fs.mkdir(folder, { recursive: true });
        await fs.writeFile(fullName, buffer, "utf-8");
        const filePath = projectFolder + fileName;

        const studentUpdate = await studentModel.findByIdAndUpdate(
          student._id,
          {
            [file.fieldname]: filePath,
          },
          { new: true }
        );
      }
    }

    updateObj.isProfileComplete = true;
    const updatedStudent = await studentModel.findByIdAndUpdate(
      student._id,
      { $set: updateObj },
      { new: true }
    );

    return res.status(200).send({ data: updatedStudent, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const fileUploads = async (req, res, next) => {
  try {
    const { rollNumber } = req.body;
    if (!rollNumber) {
      return res
        .status(400)
        .send({ message: "invalid request. send rollNumber", status: "fail" });
    }
    const file = req.files[0];

    if (!file) {
      return res
        .status(400)
        .send({ message: "invalid request. send file", status: "fail" });
    }
    const imageType = ["profilePic", "Id", "addressProof", "acadCert"];

    if (!imageType.contains(file.fieldname)) {
      return res.status(400).send({ message: "invalid type", status: "fail" });
    }

    const imgBuffer = Buffer.from(file.buffer, "utf-8");
    const user = await studentModel.findOne({ rollNumber });
    if (!user) {
      return res
        .status(400)
        .send({ message: "invalid user id in token. login again" });
    }

    // await fs.writeFile(
    //   join(
    //     __dirname +
    //       `/../../public/student/${rollNumber.toString()}${file.fieldname}.${
    //         file.mimetype.split("/")[1]
    //       }`
    //   ),
    //   imgBuffer,
    //   "utf-8"
    // );

    const profilePic = `${baseUrl}/public/student/${rollNumber.toString()}${
      file.fieldname
    }.${file.mimetype.split("/")[1]}`;
    const userupdate = await studentModel.updateOne(
      { rollNumber },
      { profilePic: profilePic }
    );

    return res.status(200).send({ data: userupdate, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const { id, email, password } = req.body;

    const schema = Joi.object({
      id: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$}/)
        .required(),
      email: Joi.string()
        .min(11)
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
    });
    let data = { id, email, password };
    const { error, value } = schema.validate(data);
    if (error) {
      return res
        .status(400)
        .send({ message: error.details[0].message, status: "fail" });
    }

    const deleteStudent = await studentModel.find;
    return res.status(200).send({ data: deleteStudent, status: "ok" });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
