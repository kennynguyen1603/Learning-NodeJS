// import UsersModel from "../models/users.js";
import jwt from "jsonwebtoken";
const authMiddleware = {
  authorizationAdmin: async (req, res, next) => {
    try {
      const { role } = req; // Lấy giá trị role từ request
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
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
    if (!token) {
      return res.status(401).send({ message: "No token provided." });
    }

    jwt.verify(token, process.env.MYSCRETKEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.userId;
      next();
    });
  },
};

export default authMiddleware;
