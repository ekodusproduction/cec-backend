import centerModel from "../Models/centerModel.js";
import courseModel from "../Models/courseModel.js";
import paymentsModel from "../Models/paymentModel.js";
import studentModel from "../Models/studentModel.js";
import Joi from "joi";

export const savePayments = async (req, res, next) => {
  try {
    const {
      key,
      api_version,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      lastname,
      address1,
      address2,
      city,
      state,
      country,
      zipcode,
      surl,
      furl,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      codurl,
      pg,
      drop_category,
      enforce_paymethod,
      custom_note,
      note_category,
      display_lang,
    } = req.body;
    const data = {
      key,
      api_version,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      lastname,
      address1,
      address2,
      city,
      state,
      country,
      zipcode,
      surl,
      furl,
      hash,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      codurl,
      pg,
      drop_category,
      enforce_paymethod,
      custom_note,
      note_category,
      display_lang,
    };
    const payment = await paymentsModel.create(data);
    return res.status(201).send({ data: payment, status: "ok" });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Internal server error", status: "fail" });
  }
};
