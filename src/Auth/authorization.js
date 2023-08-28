import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { env } from 'node:process';
import path from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// const appDir = dirname(`${import.meta.filename}`);

dotenv.config({path:path.join(__dirname,"../../.env") });
const jwtSecretKey =  process.env.JWT_SECRET ;

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided." });
    }

    const decodedToken = jsonwebtoken.decode(token);
    if (decodedToken.exp <= Date.now() / 1000) {
      return res.status(401).json({ message: "Token has expired." });
    }

    const isValid = await jsonwebtoken.verify(token, jwtSecretKey);

    req.id = isValid.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Session is invalid or has expired. Please login again" });
  }
};

