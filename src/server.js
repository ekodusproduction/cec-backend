import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
import { app } from "./app.js";

const uri = process.env.MONGODB_URI ;

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

const port = process.env.NODE_PORT ;
app.listen(port, () => console.log("server running on " + port));
