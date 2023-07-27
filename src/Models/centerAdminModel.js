import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const centerAdminSchema = new Schema({
    nameHoi: { type: String, required: "center admin name required", cast: '{VALUE} is not a String' },
    profilePic: { type: String, default:`public/defaultAvatar.jpeg`, cast: '{VALUE} is not a String' },
    email: { type: String, minLength: 11, maxLength: 40, required: "center admin email required", cast: '{VALUE} is not a String', unique:true },
    password: { type: String, required: "center admin password required", cast: '{VALUE} is not a String' },
    isSuperAdmin:{type:Boolean, default:false},
    whatsApp: { type: Number, required: "whatsapp number required", validate: { validator: (v) => v.toString().length == 10, message: "enter 10 digit number" }  },
    alternateNumber: { type: Number, required: "alternate mobile required", validate: { validator: (v) => v.toString().length == 10, message: "enter 10 digit number" }  },
    address: { type: String, required: "address required" },
    street: { type: String, required: "stree required" },
    policeStaion: { type: String, required: "policastation required" },
    postOffice: { type: String, required: "postoffice required" },
    district: { type: String, required: "district required" },
    pinCode: Number,
    state: { type: String, required: "state required" },
    loggedOut: { type: Date },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true,
})

const centerAdminModel = mongoose.model("centerAdmins", centerAdminSchema);
export default centerAdminModel;