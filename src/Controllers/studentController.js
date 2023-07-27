import superAdminModel from "../Models/superAdminModel.js"
import centerModel from "../Models/centerModel.js"
import centerAdminModel from "../Models/centerAdminModel.js"
import studentModel from "../Models/studentModel.js"
import fs from "fs/promises"
import APIFeatures from "../Utils/apiFeatures.js"
import courseModel from "../Models/centerModel.js"
import { dirname } from 'path';
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { sendMessage } from "../Twilio/twilio.js"
import { generateToken } from "../Auth/authentication.js"
import upload from "../app.js"
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);
dotenv.config()

export const studentRegister = async (req, res, next) => {
    try {
        const { firstName, lastName, Gender, mobile,email, course, highestQualification } = req.body;
        const baseUrl = process.env.BASE_URL;

        // if(req.files.length != 4){
        //     return res.status(400).send({ message: 'file is missing', status: "fail" })
        // }


        const center = await centerModel.findOne({ headOfInstitute: req.id })

        const count = await studentModel.find({ center: center._id, regYear: new Date().getFullYear, course }).length

        const rollNumber = `${count + 1}${`${new Date().getFullYear}`.slice(-2)}${center.franchiseCode}`

        const data = {
            firstName, lastName, Gender,
            mobile, email, highestQualification,
            center: center._id, course
        }

        const student = await studentModel.create(data)

        await fs.mkdir(appDir + `../../public/student/${rollNumber}`, { recursive: true })
        let fileNames = {};
        for (let i = 0; i < req.files.length; i++) {
            const extension = req.files[i].mimetype.split('/')[1]
            const fileName = req.files[i].fieldname
            const path = `${baseUrl}/public/student/${rollNumber}/${fileName}.${extension}`
            fileNames[fileName] = path;
            const imgBuffer = Buffer.from(req.files[i].buffer, "utf-8")
            const profilePic = `/public/student/${rollNumber}/${req.files[i].fieldname}.${req.files[i].mimetype.split('/')[1]}`
            await fs.writeFile(appDir + `../../public/student/${rollNumber}/${req.files[i].fieldname}.${req.files[i].mimetype.split('/')[1]}`, imgBuffer, "utf-8")
        }
        const text = `Student registered succesfully with CEC. Student rollnumber/registration number is ${rollNumber}`
        sendMessage(text, mobile)
        return res.status(200).send({ data: student, status: "ok" })
    } catch (err) {
        return res.status(500).send({ message: err.message, status: "fail" })
    }
}

export const getStudent = async (req, res, next) => {
    try {

        const center = await studentModel.find({ center: req.params.center_id });

        return res.status(200).send({ data: center, token: token, status: "ok" })
    } catch (err) {
        return res.status(500).send({ message: err.message, status: "fail" })
    }
}

export const updateStudent = async (req, res, next) => {
    try {
        const { id, updateField, updateValue } = req.body

        return res.status(200).send({ data: "HI", token: token, status: "ok" })
    } catch (err) {
        return res.status(500).send({ message: err.message, status: "fail" })
    }
}

export const deleteStudent = async (req, res, next) => {
    try {
        const { id, email, password } = req.body

        return res.status(200).send({ data: center, token: token, status: "ok" })
    } catch (err) {
        return res.status(500).send({ message: err.message, status: "fail" })
    }
}
