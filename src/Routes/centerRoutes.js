import { Router } from "express";
import { loginCenter } from "../Controllers/centerController.js";
import { verifyToken } from "../Auth/authorization.js";
import { createcenter, updatecenter, deletecenter , getCenter} from "../Controllers/centerController.js";

import { isCenterAdmin } from "../Auth/isCenterAdmin.js";
import { isSuperAdmin } from "../Auth/isSuperAdmin.js";
const router = Router()

router.post("/center/login", loginCenter)
router.route("/center").get( getCenter)
router.route("/center").post(verifyToken,isSuperAdmin,createcenter).put(verifyToken,isSuperAdmin,updatecenter)
router.route("/center").delete(verifyToken, deletecenter)
const centerRoutes = router
export default centerRoutes;