import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import { createOrder, updateOrder } from "../Controllers/paymentsController.js";
const router = Router();

router.route("/payments/createorder").post(verifyToken, createOrder);
router.route("/payments/updateorder").put(verifyToken, updateOrder);

const centerRoutes = router;
export default centerRoutes;
