import mongoose from "mongoose";
const Schema = mongoose.Schema;

const centerAdminSchema = new Schema(
  {
    nameHoi: {
      type: String,
      required: "center admin name required",
      cast: "{VALUE} is not a String",
    },
    profilePic: {
      type: String,
      default: `public/defaultAvatar.jpeg`,
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
    whatsApp: {
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
    landmark: { type: String, required: "landmark required" },
    houseNumber:{type:String, required:"house number required"},
    district: { type: String, required: "district required" },
    pinCode: { type: Number, required: "Number required" },
    state: { type: String, required: "state required" },
    loggedOut: { type: Date },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

const centerAdminModel = mongoose.model("centerAdmins", centerAdminSchema);
export default centerAdminModel;
