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
    const Bearer_Token = req.headers.authorization.split(" ");
    if(Bearer_Token.length != 2){
      return res.status(401).send({ message: "Token not provided." });
    }
    const token = Bearer_Token[1];
    if (!token) {
      return res.status(401).send({ message: "Token not valid." });
    }

    const decodedToken = jsonwebtoken.decode(token);
    if (decodedToken.expiresIn <= Date.now() / 1000) {
      return res.status(401).send({ message: "Token has expired." });
    }

    const isValid = await jsonwebtoken.verify(token, jwtSecretKey);

    req.id = isValid.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: "Session is invalid or has expired. Please login again" });
  }
};

