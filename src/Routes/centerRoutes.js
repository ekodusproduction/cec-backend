import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import {
  createcenter,
  updatecenter,
  deletecenter,
  getCenter,
  getAllCenter,
} from "../Controllers/centerController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
const router = Router();

router.route("/centerall").get(verifyToken, getAllCenter);
router.route("/center/:centerId").get(verifyToken, getCenter);
router
  .route("/center")
  .post(verifyToken, isSuperAdmin, createcenter)
  .put(verifyToken, updatecenter);
router.route("/center").delete(verifyToken, isSuperAdmin, deletecenter);
const centerRoutes = router;
export default centerRoutes;
