import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: "category name required",
      unique: true,
      cast: "{VALUE} is not a valid string",
    },
  },
  {
    timestamps: true,
  }
);

const categoryModel = mongoose.model("categories", categorySchema);
export default categoryModel;
