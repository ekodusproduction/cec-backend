import mongoose from "mongoose";
import centerModel from "./centerModel.js";
const Schema = mongoose.Schema;

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
      type: Date,
      required: "please provide date of birth",
      cast: "{VALUE} is not a date",
      required: "date of birth requierd",
    },

    presentAddress: { type: String, cast: "{VALUE} is not a string" },
    statePresent: { type: String, cast: "{VALUE} is not a number" },
    cityPresent: { type: String, cast: "{VALUE} is not a string" },
    pinCodePresent: { type: String, cast: "{VALUE} is not a string" },

    permanentAddress: { type: String, cast: "{VALUE} is not a string" },
    statePermanent: { type: String, cast: "{VALUE} is not a number" },
    cityPermanent: { type: String, cast: "{VALUE} is not a string" },
    pinCodePermanent: { type: String, cast: "{VALUE} is not a string" },

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
    gender: {
      type: String,
      enum: ["Female", "Male", "other"],
      cast: "{VALUE} is not valid",
    },
    email: {
      type: String,
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

    course: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    ],
    isProfileComplete: { type: Boolean, default: false },
    hasActiveCourse: { type: Boolean, default: false },
    emergencyContact: {
      type: Number,
      maxLength: 10,
      cast: "{VALUE} is not a number",
    },

    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "center",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "qualification",
      cast: "{VALUE} is not a valid object id",
    },
    year: { type: String, cast: "{VALUE} is not a valid string" },
    institute: { type: String, cast: "{VALUE} is not a valid string" },
    grade: { type: String, cast: "{VALUE} is not a valid string" },
    percentage: { type: Number, cast: "{VALUE} is not a valid number" },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

studentSchema.pre(/^find/, function(next) {
  this.select("-updatedAt -__v");
  next();
});

const studentModel = mongoose.model("students", studentSchema, "student");
export default studentModel;
