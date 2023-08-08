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
const orderSchema = Schema({
  courseId: [
    {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: "course id required",
      cast: "{VALUE} is not a object id",
    },
  ],
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "student",
    required: "student required",
    cast: "{VALUE} is not a object id",
  },
  centerId: {
    type: Schema.Types.ObjectId,
    ref: "center",
    required: "center id required",
    cast: "{VALUE} is not a object id",
  },
});
const centerSchema = new Schema(
  {
    // centerId: {
    //   type: String,
    //   required: "franchise code required",
    //   unique: true,
    //   cast: "{VALUE} is not a String",
    // },
    headOfInstitute: {
      type: Schema.Types.ObjectId,
      ref: "centerAdmin",
      required: true,
    },
    dateofReg: {
      type: Date,
      required: "franchise date of registration required",
    },
    centerCode: {
      type: String,
      maxLength: 60,
      required: "Center code required",
      cast: "{VALUE} is not a String",
    },
    centerName: {
      type: String,
      maxLength: 60,
      unique:true,
      required: "franchise name required",
      cast: "{VALUE} is not a String",
    },
    // firmType: {
    //   type: String,
    //   required: "franchise type required",
    //   cast: "{VALUE} is not a String",
    // },

    // landlineNumber: {
    //   type: Number,
    //   validate: {
    //     validator: (v) => v.toString().length == 10,
    //     message: "enter 10 digit number",
    //   },
    // },
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
    isActive: { type: Boolean, default: true },
    cart: { type: orderSchema },
  },
  {
    timestamps: true,
  }
);

centerSchema.pre(/^find/, function(next) {
  this.select("-createdAt -updatedAt -__v");
  next();
});

const centerModel = mongoose.model("centers", centerSchema, "center");

export default centerModel;
