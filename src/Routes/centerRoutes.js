import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import {
  createcenter,
  updatecenter,
  deletecenter,
  getCenter,
  getAllCenter,
  getAllInactiveCenter,
  getAllCentersUnderAdmin,
  addToCart,
  getCart,
  deleteCart,
} from "../Controllers/centerController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
const router = Router();

router.route("/center/all").get(verifyToken, getAllCenter);
router.route("/center/inactive").get(verifyToken, getAllInactiveCenter);
router
  .route("/center/centeradmin/:centeradminId")
  .get(verifyToken, getAllCentersUnderAdmin);

router.route("/center/:centerId").get(verifyToken, getCenter);
router.post("/center/cart/addtocart", verifyToken, addToCart);
router.post("/center/cart/getcart", verifyToken, getCart);
router.post("/center/cart/deletecart", verifyToken, deleteCart);

router
  .route("/center")
  .post(verifyToken, isSuperAdmin, createcenter)
  .put(verifyToken, updatecenter);
router.route("/center").delete(verifyToken, isSuperAdmin, deletecenter);

const centerRoutes = router;
export default centerRoutes;
