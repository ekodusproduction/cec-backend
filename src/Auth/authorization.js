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
    const token = req.headers.authorization.split(" ");
    console.log("hi")

    const isvalid = await jsonwebtoken.verify(token[1], jwtSecretKey);

    req.id = isvalid.id;
    next();
  } catch (err) {
    console.log(err);
    return res.redirect("/api/superadmin/login");
  }
};
