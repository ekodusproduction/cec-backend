import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import { createCart } from "../Controllers/cartController.js";
const router = Router();

router.route("/cart/createCart").post(verifyToken, createCart);

const centerRoutes = router;
export default centerRoutes;
