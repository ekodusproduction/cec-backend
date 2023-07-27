import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import { studentRegister,getStudent,deleteStudent, updateStudent } from "../Controllers/studentController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
import { isCenterAdmin } from "../Auth/isCenterAdmin.js";

const router = Router()

router.route("/student").post(verifyToken,isCenterAdmin, studentRegister)
router.route("/student").get(verifyToken, getStudent)
router.route("/student").delete(verifyToken, deleteStudent)
router.route("/student").put(verifyToken, isSuperAdmin, updateStudent)


const studentRoutes = router
export default studentRoutes;