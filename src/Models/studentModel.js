import mongoose from "mongoose";
const Schema = mongoose.Schema;

// const addressSchema = mongoose.Schema({
//     address: String,
//     street: String,
//     district: String,
//     houseNumber: Number,
//     pin: Number,
//     state: String,
//     country: String,
// });

// const academicSchema = mongoose.Schema({
//     qualification: String,
//     year: String,
//     university: String,
//     grade: String,
//     percentage: Number,
// });

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: "please provide firstName",
      minLength: 3,
      maxLength: 25,
      cast: "{VALUE} is not a string",
    },
    lastName: {
      type: String,
      required: "please provide lastName",
      minLength: 3,
      maxLength: 25,
      cast: "{VALUE} is not a string",
    },
    rollNumber: {
      type: String,
      required: "please provide rollNumber",
      minLength: 3,
      maxLength: 20,
      unique: true,
      cast: "{VALUE} is not a string",
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
    DOB: {
      type: String,
      required: "please provide date of birth",
      cast: "{VALUE} is not a date",
      required: "date of birth requierd",
    },

    presentAddress: { type: String, cast: "{VALUE} is not a string" },
    houseNumberPresent: { type: Number, cast: "{VALUE} is not a number" },
    cityPresent: { type: String, cast: "{VALUE} is not a string" },
    pinCodePresent: { type: String, cast: "{VALUE} is not a string" },

    permanentAddress: { type: String, cast: "{VALUE} is not a string" },
    houseNumberPermanent: { type: Number, cast: "{VALUE} is not a number" },
    cityPermanent: { type: String, cast: "{VALUE} is not a string" },
    pinCodePermanent: { type: String, cast: "{VALUE} is not a string" },

    paymentDone: { type: String, default: false },
    fathersName: {
      type: String,
      minLength: 3,
      maxLength: 25,
      cast: "{VALUE} is not a string",
    },
    mothersName: {
      type: String,
      minLength: 3,
      maxLength: 25,
      cast: "{VALUE} is not a string",
    },
    Gender: {
      type: String,
      enum: ["Female", "Male", "other"],
      required: "please provide gender",
      cast: "{VALUE} is not valid",
    },
    email: {
      type: String,
      required: "please provide email",
      minLength: 11,
      maxLength: 30,
      cast: "{VALUE} is not a string",
    },

    bloodGroup: { type: String, cast: "{VALUE} is not a string" },
    caste: {
      type: String,
      enum: ["open", "obc", "sc", "st"],
      cast: "{VALUE} is not a valid string",
    },
    BPL: {
      type: String,
      enum: ["yes", "no"],
      cast: "{VALUE} is not a valid string",
    },
    regYear: { type: String, cast: "{VALUE} is not a date" },

    stdCode: { type: Number, cast: "{VALUE} is not a number" },
    course: {
      type: Schema.Types.ObjectId,
      ref: "courses",
      cast: "{VALUE} is not a valid object id",
    },
    hasActiveCourse: { type: Boolean, default: false },
    emergencyContact: {
      type: Number,
      maxLength: 10,
      cast: "{VALUE} is not a number",
    },

    center: {
      type: Schema.Types.ObjectId,
      ref: "courses",
      required: "please provide center",
      cast: "{VALUE} is not a valid object id",
    },

    addressProof: { type: String, cast: "{VALUE} is not a valid string" },
    idProof: { type: String, cast: "{VALUE} is not a valid string" },
    academicCertificates: {
      type: String,
      cast: "{VALUE} is not a valid string",
    },
    qualification: {
      type: String,
      required: "qualification required",
      cast: "{VALUE} is not a valid string",
    },
    year: { type: String, cast: "{VALUE} is not a valid string" },
    university: { type: String, cast: "{VALUE} is not a valid string" },
    grade: { type: String, cast: "{VALUE} is not a valid string" },
    percentage: { type: Number, cast: "{VALUE} is not a valid number" },
  },
  {
    timestamps: true,
  }
);

studentSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ isActive: { $ne: false } });
  next();
});

const studentModel = mongoose.model("students", studentSchema);
export default studentModel;
