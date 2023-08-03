import { Router } from "express";

import { verifyToken } from "../Auth/authorization.js";
import {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  filterCourses
} from "../Controllers/courseController.js";

const router = Router();
router
  .route("/course")
  .post(verifyToken, createCourse)
  .get(verifyToken, getCourse);

router
  .route("/course/:courseId")
  .put(verifyToken, updateCourse)
  .delete(verifyToken, deleteCourse);

router.route("/course/qualification/:qualificationId").put(verifyToken, filterCourses);

const courseRoutes = router;
export default courseRoutes;
