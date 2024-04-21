import { Router } from "express";
import usersController from "../controllers/user.js";
const UserRouter = Router();

UserRouter.post("", usersController.createNewUser);

export default UserRouter;
