import { Router } from "express";
import postsController from "../controllers/post.js";

const PostRouter = Router();
PostRouter.post("", postsController.createPost);
PostRouter.put("/:postId", postsController.updatePost);

export default PostRouter;
