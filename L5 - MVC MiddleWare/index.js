import express from "express";
import mongoose from "mongoose";
import rootRouterV1 from "./api/routers/index.js";
// import usersController from "./api/controllers/user.js";

await mongoose.connect(
  "mongodb+srv://kennynguyen1603young:590199@kennynguyen.ezzwilu.mongodb.net/learningmgdb?retryWrites=true&w=majority&appName=KennyNguyen"
);
const app = express();

app.use(express.json());

app.use("/api/v1", rootRouterV1);

// // 1. Viết API việc đăng ký user.cv
// app.post("/api/v1/users", usersController.createNewUser);

// // 2. Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
// app.post("/api/v1/posts", postsController.createPost);

// // 3. Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
// app.put("/api/v1/posts/:postId", postsController.updatePost);

// // 4. Viết API cho phép user được comment vào bài post.
// app.post("/api/v1/posts/:postId/comments", commentController.createComment);

// // 5. Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa).
// app.put("/api/v1/comments/:commentId", commentController.updateComment);

// // 6. Viết API lấy tất cả comment của một bài post.
// app.get("/api/v1/posts/:postId/comments", commentController.getAllComment);

// // 8. Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId.
// app.get("/api/v1/posts/:postId", postsController.getPost);

// //7. Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user.
// app.get("/api/v1/post-with-comments", postsController.getPostWithComment);

app.listen(8080, () => {
  console.log("Server is running! 123");
});
