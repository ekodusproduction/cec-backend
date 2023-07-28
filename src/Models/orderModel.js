import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "courses",
      required: "course category required",
      cast: "{VALUE} is not a object id",
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("courses", orderSchema);
export default orderModel;
