import { Router } from "express";
import postsController from "../controllers/post.js";

const PostRouter = Router();
PostRouter.post("", postsController.createPost);

export default PostRouter;
