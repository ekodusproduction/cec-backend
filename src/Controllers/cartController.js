import centerModel from "../Models/centerModel.js";
import courseModel from "../Models/courseModel.js";
import studentModel from "../Models/studentModel.js";

export const createCart = async (req, res, next) => {
  try {
    const { studentId, courseId, centerId } = req.body;
    const studentExist = await studentModel.countDocuments({
      _id: studentId.studentId,
    });

    if (studentExist == 0) {
      return res.status(400).send({
        message: "invalid request. please send valid student id",
        status: "fail",
      });
    }

    const courseExist = await courseModel.countDocuments({
      _id: courseId.courseId,
    });

    if (courseExist == 0) {
      return res.status(400).send({
        message: "invalid request. please send valid course id",
        status: "fail",
      });
    }

    const data = { studentId, courseId, centerId };
    const order = await centerModel.findById(centerId);
    if (order.cart == []) {
      await order.cart.push(data).save();
    } else {
      await order.cart.courseId.push(courseId).save();
    }

    return res.status(200).send({ data: order, status: "ok" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Internal server error", status: "fail" });
  }
};
