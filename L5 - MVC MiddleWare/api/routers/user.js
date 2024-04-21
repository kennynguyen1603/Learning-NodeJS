import { Router } from "express";
import usersController from "../controllers/user.js";
import userAuthentication from "../middleware/user.js";

const UserRouter = Router();

// Lấy toàn bộ users
UserRouter.get("", usersController.getAllUser);

// 1. Viết API việc đăng ký user.cv
UserRouter.post("", userAuthentication, usersController.createNewUser);

export default UserRouter;
