import { Router } from "express";
import PostRouter from "./post.js";
import CommentRouter from "./comment.js";
import UserRouter from "./user.js";

const rootRouterV1 = Router();
rootRouterV1.use("/users", UserRouter);
rootRouterV1.use("/comments", CommentRouter);
rootRouterV1.use("/posts", PostRouter);

export default rootRouterV1;
