import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { env } from 'node:process';
dotenv.config();
const jwtSecretKey =  process.env.JWT_SECRET ||  "ZXNEASPOFEWYHICSADB_9QW974FEW17@#%&$%&";
console.log(jwtSecretKey)

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ");

    const isvalid = await jsonwebtoken.verify(token[1], jwtSecretKey);

    req.id = isvalid.id;
    next();
  } catch (err) {
    console.log(err);
    return res.redirect("/api/superadmin/login");
  }
};
