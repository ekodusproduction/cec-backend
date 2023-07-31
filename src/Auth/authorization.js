import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecretKey = "ZXNEASPOFEWYHICSADB_9QW974FEW17@#%&$%&" || process.env.JWT_SECRET;

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
