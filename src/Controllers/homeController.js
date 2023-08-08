import centerModel from "../Models/centerModel.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);

import studentModel from "../Models/studentModel.js";

export const getHomeCenter = async (req, res, next) => {
  try {
    const centerId = req.params.centerId; // Assuming centerId is in the request parameters

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const studentsCountLastMonth = await studentModel.countDocuments({
      centerId,
      createdAt: { $gte: oneMonthAgo },
    });

    const totalStudents = await studentModel.countDocuments({ centerId });

    const studentsRegisteredPerMonth = await getRegisteredPerMonth(
      studentModel,
      centerId
    );

    return res.status(200).send({
      data: {
        newStudentsLastMonth: studentsCountLastMonth,
        totalStudents,
        studentsRegisteredPerMonth,
      },
      status: "ok",
    });
  } catch (error) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getHomeSuper = async (req, res, next) => {
  try {
    // Calculate date one year ago from today
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const studentsCountLastMonth = await studentModel.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    const totalCenters = await centerModel.countDocuments();
    const totalStudents = await studentModel.countDocuments();

    const newCoursesLastMonth = await courseModel.find({
      createdAt: { $gte: oneMonthAgo },
    });

    const totalCourses = await courseModel.countDocuments();

    const newCentersLastMonth = await centerModel.find({
      createdAt: { $gte: oneMonthAgo },
    });

    const studentsRegisteredPerMonth = await getRegisteredPerMonth(
      studentModel
    );
    const centersRegisteredPerMonth = await getRegisteredPerMonth(centerModel);

    return res.status(200).send({
      data: {
        newStudentsLastMonth: studentsCountLastMonth,
        totalCenters,
        totalStudents,
        newCoursesLastMonth,
        totalCourses,
        newCentersLastMonth,
        studentsRegisteredPerMonth,
        centersRegisteredPerMonth,
      },
      status: "ok",
    });
  } catch (error) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
