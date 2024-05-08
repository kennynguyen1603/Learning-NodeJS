import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const token = {
  generateToken: (userData, expiresIn) => {
    return jwt.sign({ userData }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: expiresIn ?? "15m",
    });
  },
};

export { token };
