import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import {
  createcenter,
  updateCenter,
  deletecenter,
  getCenter,
  getAllCenter,
  getAllInactiveCenter,
  getAllCentersUnderAdmin,
  changePassword,
  addToCart,
  getCart,
  deleteCart,
  loginCenter,
} from "../Controllers/centerController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
const router = Router();

router.route("/center/login").post(loginCenter);

router.route("/center/all").get(verifyToken, isSuperAdmin, getAllCenter);
router.route("/center/inactive").get(verifyToken, getAllInactiveCenter);
router
  .route("/center/centeradmin/:centeradminId")
  .get(verifyToken, getAllCentersUnderAdmin);

router.route("/center/:centerId").get(verifyToken, getCenter);
router.route("/center/:centerId").put(verifyToken, updateCenter);

router.put("/center/cart/addtocart", verifyToken, addToCart);
router.get("/center/cart/getcart", verifyToken, getCart);
router.delete("/center/cart/deletecart", verifyToken, deleteCart);

router.route("/center").post(verifyToken, isSuperAdmin, createcenter);
router.route("/center").delete(verifyToken, isSuperAdmin, deletecenter);
router
  .route("/center/login/changepassword")
  .post(verifyToken, isSuperAdmin, changePassword);

const centerRoutes = router;
export default centerRoutes;
