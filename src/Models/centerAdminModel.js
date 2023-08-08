import mongoose from "mongoose";
const Schema = mongoose.Schema;


const centerAdminSchema = new Schema(
  {
    adminName: {
      type: String,
      required: "center admin name required",
      cast: "{VALUE} is not a String",
      minlength: 3,
    },
    profilePic: {
      type: String,
      default: `public/defaultAvatar.png`,
      cast: "{VALUE} is not a String",
    },
    email: {
      type: String,
      minLength: 11,
      maxLength: 40,
      required: "center admin email required",
      cast: "{VALUE} is not a String",
      unique: true,
    },
    password: {
      type: String,
      required: "center admin password required",
      cast: "{VALUE} is not a String",
    },
    isSuperAdmin: { type: Boolean, default: false },
    centers: [{ type: Schema.Types.ObjectId, ref: "centers" }],
    mobile: {
      type: Number,
      required: "whatsapp number required",
      validate: {
        validator: (v) => v.toString().length == 10,
        message: "enter 10 digit number",
      },
    },
    alternateNumber: {
      type: Number,
      validate: {
        validator: (v) => v.toString().length == 10,
        message: "enter 10 digit number",
      },
    },
    address: { type: String, required: "address required" },
    district: { type: String, required: "district required" },
    pinCode: { type: Number, required: "Number required" },
    state: { type: String, required: "state required" },
    loggedOut: { type: Date },
    isActive: { type: Boolean, default: true },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

centerAdminSchema.pre(/^find/, function(next) {
  this.select("-createdAt -updatedAt -__v");
  next();
});

const centerAdminModel = mongoose.model(
  "centerAdmins",
  centerAdminSchema,
  "centerAdmin"
);

export default centerAdminModel;
