import { Router } from "express";
import { verifyToken } from "../Auth/authorization.js";
import { savePayments } from "../Controllers/paymentsController.js";
const router = Router();

router.route("/payments/savePayments").put(verifyToken, savePayments);

const centerRoutes = router;
export default centerRoutes;
