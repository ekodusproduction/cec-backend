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
  getStudentByRoll,
  studentRegisterCenter,
} from "../Controllers/studentController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";

const router = Router();

router.route("/student").post(verifyToken, studentRegister);
router.route("/student/center").post(verifyToken, studentRegisterCenter);

router.route("/student/update/:rollNumber").put(verifyToken, updateStudent);

router
  .route("/student/:studentId")
  .delete(verifyToken, isSuperAdmin, deleteStudent);

router.route("/student/all").get(verifyToken, isSuperAdmin,getallStudentSuper);
router.route("/student/center/:centerId").get(verifyToken, getallStudentCenter);
router.route("/student/inactive").get(verifyToken, getallInactiveStudent);

router.route("/student/studentid/:studentId").get(verifyToken, getStudentById);
router.route("/student/roll/:rollNumber").get(verifyToken, getStudentByRoll);

router.route("/student/course/:courseid").put(verifyToken, addNewCourse);

const studentRoutes = router;
export default studentRoutes;
