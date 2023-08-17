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

const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() =>
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    )
  )
  .catch((err) => console.log(err));

  mongoose.connection.syncIndexes()
  .then(() => {
    console.log("Indexes synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing indexes:", error);
  });

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => console.log("server running on " + port));
