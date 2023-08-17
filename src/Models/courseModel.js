import mongoose from "mongoose";
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: "course name required",
      unique: true,
      minlength: 3,
      maxlength: 50,
      cast: "{VALUE} is not a String",
    },
    courseDescription: {
      type: String,
      required: "course description required",
      minlength: 5,
      maxlength: 200,
      cast: "{VALUE} is not a String",
    },
    courseCode: {
      type: String,
      required: "course code required",
      unique: true,
      minlength: 3,
      maxlength: 6,
      validate:{
        validator: (v) => v.toString().length == 3,
        message:"code length should be 3"
      },
      cast: "{VALUE} is not a String",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: "course category required",
      cast: "{VALUE} is not a object id",
    },
    duration: {
      type: Number,
      minlength: 1,
      required: "course duration required",
      cast: "{VALUE} is not a Number",
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

courseSchema.pre(/^find/, function(next) {
  this.select("-createdAt -updatedAt -__v");
  next();
});
mongoose.connection.syncIndexes()
  .then(() => {
    console.log("Indexes synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing indexes:", error);
  });

// courseSchema.pre("save", async function (next) {
//   const existingCourse = await this.constructor.findOne({
//     courseCode: this.courseCode,
//   });

//   if (existingCourse) {
//     this.invalidate("courseCode", "Course code must be unique.");
//   }

//   next();
// });

const courseModel = mongoose.model("courses", courseSchema, "course");
export default courseModel;
