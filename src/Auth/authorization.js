import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { env } from "node:process";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
// const appDir = dirname(`${import.meta.filename}`);

dotenv.config({ path: path.join(__dirname, "../../.env") });
const jwtSecretKey = process.env.JWT_SECRET;

export const verifyToken = async (req, res, next) => {
  try {
    console.log("authorization", req.headers.authorization);
    const Bearer_Token = req.headers.authorization;
    if (!Bearer_Token) {
      return res
        .status(400)
        .send({ message: "Token not provided.", status: 400 });
    }
    const token = Bearer_Token.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Token not valid.", status: 401 });
    }

    const decodedToken = jsonwebtoken.decode(token);
    if (decodedToken.expiresIn <= Date.now()) {
      return res
        .status(401)
        .send({ message: "Token has expired. Please login again.", status: 401 });
    }

    const isValid = await jsonwebtoken.verify(token, jwtSecretKey);

    req.id = isValid.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: "Session is invalid or has expired. Please login again",
      status: 401,
    });
  }
};
