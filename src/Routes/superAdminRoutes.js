import { Router } from "express";
import {
  createSuperAdmin,
  deleteSuperAdmin,
  getSuperAdmin,
  loginSuperAdmin,
  updateSuperAdmin,
} from "../Controllers/superAdminController.js";
import { generateToken } from "../Auth/authentication.js";
import { verifyToken } from "../Auth/authorization.js";
import multer from "multer";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
const router = Router();

router.route("/superadmin").post(createSuperAdmin);

router
  .route("/superadmin")
  .get(verifyToken, isSuperAdmin, getSuperAdmin)
  .put(verifyToken, isSuperAdmin, updateSuperAdmin)
  .delete(verifyToken, isSuperAdmin, deleteSuperAdmin);

router.route("/superadmin/login").post(loginSuperAdmin);

export const superAdminRoutes = router;
export default superAdminRoutes;
