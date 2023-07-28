import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: "please provide firstName",
      cast: "{VALUE} is not a string",
    },
    lastName: {
      type: String,
      required: "please provide lastName",
      cast: "{VALUE} is not a  string",
    },
    mobile: {
      type: Number,
      required: "please provide mobile",
      cast: "{VALUE} is not a number",
      validate: {
        validator: (v) => v.toString().length == 10,
        message: "enter 10 digit number",
      },
    },
    email: {
      type: String,
      required: "please provide email",
      unique: true,
      cast: "{VALUE} is not a valid string",
    },
    password: { type: String, required: "please provide password" },
    profilePic: { type: String },
    isActive: { type: Boolean, default: true },
    isSuperAdmin: { type: Boolean, default: true },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

const superAdminModel = mongoose.model("superAdmins", superAdminSchema);
export default superAdminModel;
