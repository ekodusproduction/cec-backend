import { Router } from "express";

import { verifyToken } from "../Auth/authorization.js";
import {
  createQualification,
  getQualification,
  updateQualification,
  deleteQualification,
} from "../Controllers/qualificationController.js";

const router = Router();
router
  .route("/qualification")
  .post(verifyToken, createQualification)
  .get(verifyToken, getQualification);

router
  .route("/qualification/:qualificationId")
  .put(verifyToken, updateQualification)
  .delete(verifyToken, deleteQualification);

const qualificationRoutes = router;
export default qualificationRoutes;
