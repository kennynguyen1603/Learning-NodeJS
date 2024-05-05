import { Router } from "express";
import { userAuthentication } from "../middleware/user.js";
import usersController from "../controllers/user.js";
import authMiddleware from "../middleware/auth.js";

const UserRouter = Router();

// Lấy toàn bộ users
UserRouter.get(
  "",
  userAuthentication,
  authMiddleware.authorizationAdmin,
  usersController.getAllUser
);

// 1. Viết API việc đăng ký user.cv
UserRouter.post("/register", usersController.register);

// 2. Đăng nhập
UserRouter.post("/login", userAuthentication, usersController.login);
export default UserRouter;
