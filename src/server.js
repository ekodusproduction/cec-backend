import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
dotenv.config();
import { app } from "./app.js";

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/myapp";

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
