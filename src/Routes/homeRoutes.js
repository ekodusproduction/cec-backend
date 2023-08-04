import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import {
    getHomeCenter,
  getHomeSuper,
} from "../Controllers/homeController.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
const router = Router();

router.route("/home/center").get(verifyToken, getHomeCenter);
router.route("/home/super").get(verifyToken, getHomeSuper);

const centerRoutes = router;
export default centerRoutes;
