import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import {
  createcenter,
  updatecenter,
  deletecenter,
  getCenter,
  getAllCenter,
  getAllInactiveCenter,
  getAllCentersUnderAdmin
} from "../Controllers/centerController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
const router = Router();

router.route("/center/all").get(verifyToken, getAllCenter);
router.route("/center/inactive").get(verifyToken, getAllInactiveCenter);
router.route("/center/centeradmin/:centeradminId").get(verifyToken, getAllCentersUnderAdmin);
router.route("/center/:centerId").get(verifyToken, getCenter);

router
  .route("/center")
  .post(verifyToken, isSuperAdmin, createcenter)
  .put(verifyToken, updatecenter);
router.route("/center").delete(verifyToken, isSuperAdmin, deletecenter);
const centerRoutes = router;
export default centerRoutes;
