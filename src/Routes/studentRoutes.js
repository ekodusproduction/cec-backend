import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import {
  studentRegister,
  getStudent,
  deleteStudent,
  updateStudent,
} from "../Controllers/studentController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
import { isCenterAdmin } from "../Auth/isCenterAdmin.js";

const router = Router();

router.route("/student").post(verifyToken, studentRegister);
router.route("/student/:centerid").get(verifyToken, getStudent);
router.route("/student").put(verifyToken, isSuperAdmin, updateStudent);
router.route("/student").delete(verifyToken, deleteStudent);

const studentRoutes = router;
export default studentRoutes;
