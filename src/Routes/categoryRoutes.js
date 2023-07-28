import { Router } from "express";

import { verifyToken } from "../Auth/authorization.js";
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCateory,
} from "../Controllers/courseCategoryController.js";

const router = Router();
router
  .route("/category")
  .post(verifyToken, createCategory)
  .get(verifyToken, getCategory);
router
  .route("/category/:categoryId")
  .put(verifyToken, updateCateory)
  .delete(verifyToken, deleteCategory);

const categoryRoutes = router;
export default categoryRoutes;
