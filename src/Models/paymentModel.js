import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    courseId: [{ type: Schema.Types.ObjectId, ref: "courses", required: true }],
    studentId: [
      { type: Schema.Types.ObjectId, ref: "students", required: true },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    order_id: { type: String, required: true },
    invoice_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const paymentsModel = mongoose.model("payments", paymentSchema, "payment");
export default paymentsModel;

