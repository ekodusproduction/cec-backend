import { Router } from "express";

import { verifyToken } from "../Auth/authorization.js";
import {
  createcenterAdmin,
  getcenterAdmin,
  updatecenterAdmin,
  deletecenterAdmin,
  getAllcenterAdmin,
} from "../Controllers/centerAdminController.js";
import { loginCenteradmin } from "../Controllers/centerAdminController.js";

const router = Router();
router.route("/centeradmin/login").post(loginCenteradmin);
router
  .route("/centeradmin")
  .post(verifyToken, createcenterAdmin)
  .put(verifyToken, updatecenterAdmin)
  .delete(verifyToken, deletecenterAdmin)
  .get(verifyToken, getcenterAdmin);

router.route("/centeradminsall").get(verifyToken, getAllcenterAdmin);


const centerAdminRoutes = router;
export default centerAdminRoutes;
