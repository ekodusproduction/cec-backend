import dotenv from "dotenv";
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import twilio from "twilio";
twilio(accountSid, authToken);

export const sendMessage = (text, mobile) => {
  twilio.client.messages
    .create({
      body: `${text}`,
      messagingServiceSid: "MGc8809ca1d8785f14aa862194a9f4fb71",
      to: `${mobile}`,
    })
    .then((message) => console.log(message.sid))
    .done();
};

export default twilio;
