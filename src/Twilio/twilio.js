import dotenv from "dotenv";
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import twilio from "twilio";
const TWILIO_AUTH_TOKEN = "ab98013a2ec1df45bc600f17df246e41"
const TWILIO_ACCOUNT_SID = "AC8771753e19b3f87d905122c7f49f0eed"
twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),{ accountSid: 'AC' };
console.log(accountSid, authToken);

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
