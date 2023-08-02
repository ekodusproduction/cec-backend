import mongoose from "mongoose";
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: "course name required",
      unique: true,
      minlength:3,
      maxlength:50,
      cast: "{VALUE} is not a String",
    },
    courseDescription: {
      type: String,
      required: "course description required",
      minlength:5,
      maxlength:200,
      cast: "{VALUE} is not a String",
    },
    courseCode: {
      type: String,
      required: "course code required",
      unique: true,
      minlength:3,
      maxlength:6,
      cast: "{VALUE} is not a String",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: "course category required",
      cast: "{VALUE} is not a object id",
    },
    duration: {
      type: String,
      minlength:2,
      required: "course duration required",
      cast: "{VALUE} is not a String",
    },
    qualificationType: {
      type: Schema.Types.ObjectId,
      ref: "qualification",
      required: true,
    },
    courseFee: {
      type: Number,
      required: "course fee required",
      cast: "{VALUE} is not a number",
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model("courses", courseSchema, "course");
export default courseModel;
