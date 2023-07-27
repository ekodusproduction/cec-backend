import superAdminModel from "../Models/superAdminModel.js"
import centerModel from "../Models/centerModel.js"
import centerAdminModel from "../Models/centerAdminModel.js"
import bcrypt from "bcrypt"
import { generateToken } from "../Auth/authentication.js"
import APIFeatures from "../Utils/apiFeatures.js"
import fs from 'fs/promises'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = dirname(`${import.meta.filename}`);

export const loginCenter = async (req, res, next) => {
    try {
        const { centerId, password } = req.body
        const centerAdmin = await centerAdminModel.findOne({ email: email })
        const isCorrectPassword = await bcrypt.compare(password, centerAdmin.password)
        const token = generateToken(centerAdmin._id)

        return res.status(200).send({ data: centerAdmin, token: token, status: "ok" })
    } catch (err) {
        return res.status(500).send({ message: err.message, status: "fail" })
    }
}

export const getCenter = async (req, res, next) => {
    try {
        const centerId = req.query;
        if (centerId.centerId) {
            const center = await centerModel.findById(centerId.centerId).populate('headOfInstitute')
            return res.status(200).send({ data: center, status: "ok" })
        }
        console.log("hi")
        const center = await centerModel.find({})
        return res.status(200).send({ data: center, status: "ok" })
    } catch (err) {
        return res.status(500).send({ message: err.message, status: "fail" })
    }
}

export const createcenter = async (req, res, next) => {
    try {
        const requestBody = req.body;
        const centerAdmin = JSON.parse(requestBody.centerAdminInfo)
        const file = req.files[0]
        console.log(file.originalname)
        const imgBuffer = Buffer.from(file.buffer, "utf-8")
        const user = await centerAdminModel.create(centerAdmin.centerAdminInfo)
        const profilePic = `/public/center/${user.id.slice(-6)}${file.originalname}`
        await fs.writeFile(appDir + `../../public/center/${user.id.slice(-6)}${file.originalname}`, imgBuffer, "utf-8")
        await centerAdminModel.updateOne({ _id: user.id }, { $set: { profilePic: profilePic } })
        if (!user) {
            return res.status(400).send({ message: "centerAdmin creation failed", status: "ok" })
        }
        const center = JSON.parse(requestBody.centerInfo).centerInfo
        let { dateofReg } = center
        dateofReg = new Date(dateofReg).toLocaleString('en', { dateStyle: 'short' })
        const centerInfo = { ...center, dateofReg, headOfInstitute: user._id }
        const centerCreated = await centerModel.create(centerInfo)
        return res.status(200).send({ data: centerCreated, status: "ok" })
    } catch (err) {
        return res.status(500).send({ message: err.message, status: "fail" })
    }
}

export const updatecenter = async (req, res, next) => {
    try {
        const requestBody = req.body;
        const { id, updateField, updateValue } = requestBody
        console.log(updateField, updateValue)
        const dynamicUpdate = { [updateField]: updateValue };
        if (updateField == "courses" || updateField == "categories") {
            const update = await centerModel.findByIdAndUpdate({ _id: id }, { $addToSet : dynamicUpdate }, { new: true });
            return res.status(200).send({ data: update, status: "ok" })
        } else {
            const update = await centerModel.findByIdAndUpdate({ _id: id }, dynamicUpdate, { new: true });
            return res.status(200).send({ data: update, status: "ok" })
        }

    } catch (err) {
        return res.status(500).send({ message: err.message, status: "fail" })
    }
}

export const deletecenter = async (req, res, next) => {
    try {
        const requestBody = req.body;
        const centerId = req.query;
        const { email, password } = requestBody
        const user = await superAdminModel.findById({ _id: req.id })

        if (!(email == user.email && await bcrypt.compare(password, user.password))) {
            return res.status(400).send({ message: "please enter correct password or email", status: "ok" })
        }
        const userdeleted = await centerModel.updateOne({ _id: centerId.centerId }, { $set: { isActive: false } }, { new: true })

        return res.status(200).send({ data: user, status: "ok" })
    } catch (err) {
        return res.status(500).send({ message: err.message, status: "fail" })
    }
}
