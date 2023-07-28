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
  .route("/qualificatio")
  .post(verifyToken, createQualification)
  .put(verifyToken, updateQualification)
  .delete(verifyToken, deleteQualification)
  .get(verifyToken, getQualification);

const qualificationRoutes = router;
export default qualificationRoutes;
