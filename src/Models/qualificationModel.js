import mongoose from "mongoose";
const Schema = mongoose.Schema;

const qualificaitonSchema = new Schema(
  {
    qualification: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const qualificationModel = mongoose.model("qualification", qualificaitonSchema);
export default qualificationModel;
