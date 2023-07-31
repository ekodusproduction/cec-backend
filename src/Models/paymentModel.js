import mongoose from "mongoose";
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    id: { type: String, required: true },
    courseId: [{ type: Schema.ObjectId, required: true }],
    studentId : [{ type: Schema.ObjectId, required: true }],
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    order_id: { type: String, required: true },
    invoice_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const paymentsModel = mongoose.model("payments", paymentSchema);
export default paymentsModel;
