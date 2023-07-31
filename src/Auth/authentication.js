import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecretKey =  process.env.JWT_SECRET ||  "ZXNEASPOFEWYHICSADB_9QW974FEW17@#%&$%&";
console.log(jwtSecretKey)
export const generateToken = (data) => {
  const token = jsonwebtoken.sign(
    {
      id: data,
    },
    jwtSecretKey,
    { expiresIn: process.env.JWT_EXP|| `1d` }
  );
  return token;
};
