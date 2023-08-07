import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";

import path from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";

import superAdminModel from "./Models/superAdminModel.js";
import centerAdminModel from "./Models/centerAdminModel.js";
import centerModel from "./Models/centerModel.js";
import courseModel from "./Models/courseModel.js";
import categoryModel from "./Models/courseCategoryModel.js";
import qualificationModel from "./Models/qualificationModel.js";
import studentModel from "./Models/studentModel.js";
import orderModel from "./Models/orderModel.js";
import paymentsModel from "./Models/paymentModel.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({path:path.join(__dirname,"../.env") });
import { app } from "./app.js";

const uri = process.env.MONGODB_URI 
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
