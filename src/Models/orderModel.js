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

orderSchema.pre(/^find/, function (next) {
  this.select('-createdAt -updatedAt -__v');
  next();
});

const orderModel = mongoose.model("order", orderSchema, "order");
export default orderModel;
