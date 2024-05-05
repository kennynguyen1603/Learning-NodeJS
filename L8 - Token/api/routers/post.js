import { Router } from "express";
import postsController from "../controllers/post.js";
import authMiddleware from "../middleware/auth.js";
import { userAuthentication } from "../middleware/user.js";

const PostRouter = Router();

// 2. Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
PostRouter.post("", postsController.createPost);

// 3. Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
PostRouter.put("/:postId", userAuthentication, postsController.updatePost);

// 4. Viết API cho phép user được comment vào bài post.
PostRouter.post(
  "/:postId/comments",
  userAuthentication,
  postsController.commentOnPosts
);

// 6. Viết API lấy tất cả comment của một bài post.
PostRouter.get("/:postId/comments", postsController.commentsOfPost);

//7. Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user.
PostRouter.get("/post-with-comments", postsController.getPostWithComment);

// 8. Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId.
PostRouter.get("/:postId", postsController.getPost);

export default PostRouter;
