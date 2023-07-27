
import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET;

export const generateToken = (data)=>{
        const token = jsonwebtoken.sign({
            id: data,
          }, jwtSecretKey,{ expiresIn: process.env.JWT_EXP });
        return token;
}
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};