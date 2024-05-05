import { Router } from "express";
import commentController from "../controllers/comment.js";

const CommentRouter = Router();

// 5. Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa).
CommentRouter.put("/:commentId", commentController.createComment);

export default CommentRouter;
