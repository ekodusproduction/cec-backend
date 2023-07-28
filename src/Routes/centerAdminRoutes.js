import { Router } from "express";

import { verifyToken } from "../Auth/authorization.js";
import {
  createcenterAdmin,
  getcenterAdmin,
  updatecenterAdmin,
  deletecenterAdmin,
} from "../Controllers/centerAdminController.js";

const router = Router();
router
  .route("/qualificatio")
  .post(verifyToken, createcenterAdmin)
  .put(verifyToken, updatecenterAdmin)
  .delete(verifyToken, deletecenterAdmin)
  .get(verifyToken, getcenterAdmin);

const centerAdminRoutes = router;
export default centerAdminRoutes;
