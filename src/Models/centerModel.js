import mongoose from "mongoose";
const Schema = mongoose.Schema;

const firmAddressSchema = mongoose.Schema({
  address: { type: String, required: "center address required" },
  landmark: { type: String, required: "center lanmark required" },
  policeStaion: { type: String, required: "center policeStation required" },
  postOffice: { type: String, required: "center postOffice required" },
  district: { type: String, required: "center district required" },
  pinCode: { type: String, required: "center pincode required" },
  state: { type: String, required: "center state required" },
});

const contactFirmSchema = mongoose.Schema({
  stdCode: { type: Number, required: "stdCode required" },
  landlineNumber: { type: Number },
  whatsApp: { type: Number, required: "center whatsapp required" },
  alternateNumber: {
    type: Number,
    required: "center alternate mobile required",
  },
  email: { type: String, required: "center email required" },
});

const centerSchema = new Schema(
  {
    centerId: {
      type: String,
      required: "franchise code required",
      unique: true,
      cast: "{VALUE} is not a String",
    },
    headOfInstitute: { type: Schema.Types.ObjectId, ref: "centerAdmins" },
    dateofReg: {
      type: Date,
      required: "franchise date of registration required",
    },
    // password: {
    //   type: String,
    //   required: "center admin password required",
    //   cast: "{VALUE} is not a String",
    // },

    firmName: {
      type: String,
      maxLength: 60,
      required: "franchise name required",
      cast: "{VALUE} is not a String",
    },
    firmType: {
      type: String,
      required: "franchise type required",
      cast: "{VALUE} is not a String",
    },
    // typeOfInstitution: {
    //   type: String,
    //   required: "franchise type of institute required",
    //   cast: "{VALUE} is not a String",
    // },
    courses: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "courses",
        },
      ]
    },
    categories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "categories",
        },
      ]
    },
    //stdCode: { type: Number, required: "stdCode required" },
    landlineNumber: {
      type: Number,
      validate: {
        validator: (v) => v.toString().length == 10,
        message: "enter 10 digit number",
      },
    },
    whatsApp: {
      type: Number,
      required: "center whatsapp required",
      validate: {
        validator: (v) => v.toString().length == 10,
        message: "enter 10 digit number",
      },
    },
    alternateNumber: {
      type: Number,
      required: "center alternate mobile required",
      validate: {
        validator: (v) => v.toString().length == 10,
        message: "enter 10 digit number",
      },
    },
    email: { type: String, required: "center email required" },
    address: { type: String, required: "center address required" },
    landmark: { type: String, required: "center lanmark required" },
    //policeStaion: { type: String, required: "center policeStation required" },
    //postOffice: { type: String, required: "center postOffice required" },
    district: { type: String, required: "center district required" },
    pinCode: { type: Number, required: "center pincode required" },
    state: { type: String, required: "center state required" },
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model("centers", centerSchema);

courseModel.create
export default courseModel;
