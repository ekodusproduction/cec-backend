import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName: { type: String, required: "course name required", unique: true, cast: '{VALUE} is not a String' },
    courseCode: { type: String, required: "course code required", unique: true, cast: '{VALUE} is not a String' },
    category: { type: Schema.Types.ObjectId, required: "course category required", cast: '{VALUE} is not a object id' },
    duration: { type: String, required: "course duration required", cast: '{VALUE} is not a String' },
    qualification: { type: String, required: "course qualification required", cast: '{VALUE} is not a String' },
    courseFee: { type: String, required: "course fee required", cast: '{VALUE} is not a number' },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
})



const courseModel = mongoose.model("courses", courseSchema);
export default courseModel;