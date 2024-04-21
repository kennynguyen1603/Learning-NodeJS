import { Router } from "express";
// import CommentsModel from "../models/comments";
import commentController from "../controllers/comment.js";

const CommentRouter = Router();

CommentRouter.put("/:commentId", commentController.createComment);

export default CommentRouter;
