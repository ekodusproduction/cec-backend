import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    courseId: [{
      type: Schema.Types.ObjectId,
      ref: "course",
      required: "course category required",
      cast: "{VALUE} is not a object id",
    }],
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "student",
      required: "course category required",
      cast: "{VALUE} is not a object id",
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "center",
      required: "course category required",
      cast: "{VALUE} is not a object id",
    },
    centerAdminId: {
      type: Schema.Types.ObjectId,
      ref: "centerAdmin",
      required: "course category required",
      cast: "{VALUE} is not a object id",
    },
    paymentId:{
      type: Schema.Types.ObjectId,
      ref: "payment",
      required: "course category required",
      cast: "{VALUE} is not a object id",
    }
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
