import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// const appDir = dirname(`${import.meta.filename}`);

dotenv.config({path:path.join(__dirname,"../../.env") });
const jwtSecretKey =  process.env.JWT_SECRET ;
console.log("jwt secret ---------------",process.env.JWT_SECRET)
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
