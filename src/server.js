import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";

import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import superAdminSchema from "./Models/superAdminModel.js";
import centerAdminSchema from "./Models/centerAdminModel.js";
import centerSchema from "./Models/centerModel.js";
import courseSchema from "./Models/courseModel.js";
import categorySchema from "./Models/courseCategoryModel.js";
import qualificaitonSchema from "./Models/qualificationModel.js";
import studentSchema from "./Models/studentModel.js";
import orderSchema from "./Models/orderModel.js";
import paymentSchema from "./Models/paymentModel.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env") });
import { app } from "./app.js";

export const superAdminModel = mongoose.model(
  "superAdmin",
  superAdminSchema,
  "superAdmin"
);
export const centerAdminModel = mongoose.model(
  "centerAdmin",
  centerAdminSchema,
  "centerAdmin"
);
export const centerModel = mongoose.model("center", centerSchema, "center");
export const courseModel = mongoose.model("course", courseSchema, "course");
export const categoryModel = mongoose.model(
  "category",
  categorySchema,
  "category"
);
export const qualificationModel = mongoose.model(
  "qualification",
  qualificaitonSchema,
  "qualification"
);
export const studentModel = mongoose.model("student", studentSchema, "student");
export const orderModel = mongoose.model("order", orderSchema, "order");
export const paymentModel = mongoose.model("payment", paymentSchema, "payment");

const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    )
  )
  .catch((err) => console.log(err));

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => console.log("server running on " + port));
