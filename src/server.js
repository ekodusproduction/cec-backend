import dotenv from "dotenv";
import mongoose from "mongoose";

import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";


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
