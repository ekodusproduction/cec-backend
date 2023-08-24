import centerModel from "../Models/centerModel.js";
import studentModel from "../Models/studentModel.js";
import courseModel from "../Models/courseModel.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);

const getRegisteredPerMonthCenter = async (model, centerId = null) => {
  try {
    console.log(centerId);
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    const oneMonthAgo = new Date(); // Define oneMonthAgo here
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    const pipeline = [
      {
        $match: {
          $and: [{ createdAt: { $gte: oneYearAgo } }, { centerId: centerId }],
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ];

    const results = await model.aggregate(pipeline);
    return results;
  } catch (error) {
    throw error;
  }
};

const getRegisteredPerMonth = async (model, centerId = null) => {
  try {
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    const oneMonthAgo = new Date(); // Define oneMonthAgo here
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: oneYearAgo },
          ...(centerId && { centerId }), // Add centerId condition if provided
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ];

    const results = await model.aggregate(pipeline);
    return results;
  } catch (error) {
    throw error;
  }
};
function getOneMonthAgo(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - 1);
  newDate.setDate(1); // Set day to the 1st
  return newDate;
}

// Helper function to get the start of the next month
function getNextMonth(date) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(1); // Set day to the 1st
  return newDate;
}

export const getHomeCenter = async (req, res, next) => {
  try {
    const centerId = req.id; // Assuming centerId is in the request parameters
    let currentDate = new Date();

    const studentsCountLastMonth = await studentModel.countDocuments({
      centerId,
      createdAt: { $gte: getOneMonthAgo(currentDate) },
    });
    const month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const monthLabels = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const studentPerMonth = await Promise.all(
      month.map(async (item) => {
        const clonedDate = new Date(currentDate); // Clone the current date
        clonedDate.setMonth(clonedDate.getMonth() - item);

        const studentsThisMonth = await studentModel.countDocuments({
          centerId,
          createdAt: {
            $gte: getOneMonthAgo(clonedDate),
            $lt: getNextMonth(clonedDate),
          },
        });

        return {
          month: monthLabels[clonedDate.getMonth()],
          students: studentsThisMonth,
        };
      })
    );

    const totalStudents = await studentModel.countDocuments({ centerId });

    return res.status(200).send({
      data: {
        newStudentsLastMonth: studentsCountLastMonth,
        totalStudents,
        studentsRegisteredPerMonth: studentPerMonth,
      },
      status: "ok",
    });
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};

export const getHomeSuper = async (req, res, next) => {
  try {
    // Calculate date one year ago from today
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const studentsCountLastMonth = await studentModel.find({
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
  } catch (err) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
