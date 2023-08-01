import axios from "axios";
import request from "request";
import dotenv from "dotenv";
dotenv.config();

export const sendMessage = async (text, mobile) => {
  const url =
    "http://openapi.airtel.in/gateway/airtel-iq-sms-utility/v2/api-docs/sendSingleSms";
  const options = {
    params: {
      customerId: "SOME_STRING_VALUE",
      destinationAddress: `${mobile}`,
      dltTemplateId: process.env.AIRTEL_DLT,
      entityId: process.env.AIRTEL_ENTITY,
      filterBlacklistNumbers: true,
      message: `${text}`,
      messageType: "SERVICE_IMPLICIT",
      metaMap: {},
      priority: true,
      sourceAddress: process.env.AIRTEL_SOURCE,
    },
    headers: { "content-type": "application/json" },
  };

  await axios.post(url, options);
};

export default Airtel;
