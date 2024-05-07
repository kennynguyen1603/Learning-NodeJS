// import UsersModel from "../models/users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const authMiddleware = {
  authorizationAdmin: async (req, res, next) => {
    try {
      const { role } = req;
      if (role === "ADMIN") {
        next();
      } else {
        res.status(403).send({
          message: "Bạn không có quyền truy cập!",
          data: null,
          success: false,
        });
      }
    } catch (error) {
      res.status(500).send({
        data: null,
        message: "Đã xảy ra lỗi trong quá trình xác thực.",
        success: false,
      });
    }
  },
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ message: "Unauthorized! No token provided." });
    }
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "No token provided." });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.userId;
      next();
    });
  },
};

export default authMiddleware;