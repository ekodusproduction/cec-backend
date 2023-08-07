import Joi from "joi";
import { dirname } from "path";
import { fileURLToPath } from "url";
import {superAdminModel} from "../server.js";
import {centerModel} from "../server.js";
import {centerAdminModel} from "../server.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);

import studentModel from "../Models/studentModel.js";

export const getHomeCenter = async (req, res, next) => {
  try {
    // Calculate date one year ago from today
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Step 1: Get the number of students registered in each month of the last year
    const studentsCountByMonth = await studentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: oneYearAgo }, // Filter students created in the last year
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by the month of creation
          count: { $sum: 1 }, // Count the number of students in each group
        },
      },
      {
        $project: {
          month: "$_id", // Rename _id to month
          count: 1, // Include the count field
          _id: 0, // Exclude _id from the results
        },
      },
      {
        $sort: { month: 1 }, // Sort by month in ascending order (1 for ascending, -1 for descending)
      },
    ]);

    // Step 2: Get the total number of students
    const totalStudentsCount = await studentModel.countDocuments();

    // Step 3: Get student details sorted by creation date in descending order
    const studentsDetails = await studentModel
      .find()
      .sort({ createdAt: -1 })
      .select("-createdAt -updatedAt -__v"); // Exclude unnecessary fields

    return res.status(200).send({
      data: {
        studentsByMonth: studentsCountByMonth,
        studentCount: totalStudentsCount,
        studentsDetail: studentsDetails,
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
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Step 1: Get the number of students registered in each month of the last year
    const studentsCountByMonth = await studentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: oneYearAgo }, // Filter students created in the last year
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group by the month of creation
          count: { $sum: 1 }, // Count the number of students in each group
        },
      },
      {
        $project: {
          month: "$_id", // Rename _id to month
          count: 1, // Include the count field
          _id: 0, // Exclude _id from the results
        },
      },
      {
        $sort: { month: 1 }, // Sort by month in ascending order (1 for ascending, -1 for descending)
      },
    ]);

    // Step 2: Get the total number of students
    const totalStudentsCount = await studentModel.countDocuments();

    // Step 3: Get student details sorted by creation date in descending order
    const studentsDetails = await studentModel
      .find()
      .sort({ createdAt: -1 })
      .select("-createdAt -updatedAt -__v"); // Exclude unnecessary fields

    const newCenters = await centerModel.find().sort({ createdAt: -1 });
    return res.status(200).send({
      data: {
        studentsByMonth: studentsCountByMonth,
        studentCount: totalStudentsCount,
        studentsDetail: studentsDetails,
        newCenters: newCenters,
      },
      status: "ok",
    });
  } catch (error) {
    return res.status(500).send({ message: err.message, status: "fail" });
  }
};
