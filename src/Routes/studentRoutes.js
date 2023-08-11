import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import {
  studentRegister,
  getStudentById,
  deleteStudent,
  updateStudent,
  getallInactiveStudent,
  addNewCourse,
  getallStudentCenter,
  getallStudentSuper,
  getStudentByRoll
} from "../Controllers/studentController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
import { isCenterAdmin } from "../Auth/isCenterAdmin.js";

const router = Router();

router.route("/student").post(verifyToken, studentRegister);
router.route("/student/all").get(verifyToken, getallStudentSuper);
router.route("/student/center/:centerId").get(verifyToken, getallStudentCenter);
router.route("/student/inactive").get(verifyToken, getallInactiveStudent);
router.route("/student/:studentId").get(verifyToken, getStudentById);
router.route("/student/studentroll/:studentroll").get(verifyToken, getStudentByRoll);
router.route("/student").put(verifyToken, updateStudent);
router.route("/student/course/:courseid").put(verifyToken, addNewCourse);
router.route("/student").delete(verifyToken, isSuperAdmin, deleteStudent);

const studentRoutes = router;
export default studentRoutes;
