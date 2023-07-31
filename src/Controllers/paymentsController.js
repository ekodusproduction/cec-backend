import courseModel from "../Models/centerModel.js";
import paymentsModel from "../Models/paymentModel.js";
import studentModel from "../Models/studentModel.js";


export const createOrder = async(req, res, next)=>{
    try{
        const {studentId, courseId} = req.body;
        const studentExist = await studentModel.countDocuments({_id:studentId.studentId})
        if(studentExist == 0){
            return res.status(400).send({message:"invalid request. please send valid student id", status:"fail"})
        }

        const courseExist = await courseModel.countDocuments({_id:courseId.courseId})
        if(courseExist == 0){
            return res.status(400).send({message:"invalid request. please send valid course id", status:"fail"})
        }

        const data = {studentId, courseId}
        const payment = await paymentsModel.create(data)
        

    }catch(err){
        return res.status(500).send({message:"Internal server error", status:"fail"})
    }
}

export const updateOrder = async(req, res, next)=>{
    try{

    }catch(err){
        return res.status(500).send({message:"Internal server error", status:"fail"})
    }
}