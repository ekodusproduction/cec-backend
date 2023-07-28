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
  .put(verifyToken, updateCourse)
  .delete(verifyToken, deleteCourse)
  .get(verifyToken, getCourse);

const courseRoutes = router;
export default courseRoutes;
