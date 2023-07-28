import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET;

export const generateToken = (data) => {
  const token = jsonwebtoken.sign(
    {
      id: data,
    },
    jwtSecretKey,
    { expiresIn: process.env.JWT_EXP }
  );
  return token;
};
