import { Router } from "express";

import { verifyToken } from "../Auth/authorization.js";
import {
  createcenterAdmin,
  getcenterAdmin,
  updateCenterAdmin,
  deletecenterAdmin,
  getAllcenterAdmin,
  getAllInactiveCenterAdmin,
  fileUpload,
} from "../Controllers/centerAdminController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";

const router = Router();
router
  .route("/centeradmin")
  .post(verifyToken, createcenterAdmin)
  .delete(verifyToken, isSuperAdmin, deletecenterAdmin)
  .get(verifyToken, getcenterAdmin);

router.route("/centeradmin/:centerAdminId").put(verifyToken, updateCenterAdmin);
router.route("/centeradmin/fileuploads").put(verifyToken, fileUpload);
router.route("/centeradmin/all").get(verifyToken, getAllcenterAdmin);
router
  .route("/centeradmin/inactive")
  .get(verifyToken, getAllInactiveCenterAdmin);

const centerAdminRoutes = router;
export default centerAdminRoutes;
