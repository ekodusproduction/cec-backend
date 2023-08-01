import mongoose from "mongoose";
const Schema = mongoose.Schema;

const qualificaitonSchema = new Schema(
  {
    qualification: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true },
    registrationFees: {
      type: Number,
      required: "registration Fees required",
      cast: "{VALUE} is not a number",
    },
  },
  {
    timestamps: true,
  }
);

const qualificationModel = mongoose.model(
  "qualification",
  qualificaitonSchema,
  "qualification"
);
export default qualificationModel;
