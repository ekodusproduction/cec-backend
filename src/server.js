import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";

import path from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// const appDir = dirname(`${import.meta.filename}`);

dotenv.config({path:path.join(__dirname,"../.env") });
import { app } from "./app.js";

const uri = process.env.MONGODB_URI ||  "mongodb+srv://jay:jay123123@cluster0.v42bh6e.mongodb.net/?retryWrites=true&w=majority";
console.log("uri -------------",process.env.MONGODB_URI)
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
