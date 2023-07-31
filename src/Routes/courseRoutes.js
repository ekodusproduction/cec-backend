import { Router } from "express";

import { verifyToken } from "../Auth/authorization.js";
import {
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
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
const courseRoutes = router;
export default courseRoutes;
