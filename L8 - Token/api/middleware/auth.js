import UsersModel from "../models/users.js";

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
};

export default authMiddleware;
