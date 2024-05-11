import express from "express";
import mongoose from "mongoose";
import UsersModel from "./model/users.js";
// import CommentsModel from "./model/comments.js";
import PostsModel from "./model/posts.js";
import CommentsModel from "./model/comments.js";

await mongoose.connect(
  "mongodb+srv://kennynguyen1603young:590199@kennynguyen.ezzwilu.mongodb.net/learningmgdb?retryWrites=true&w=majority&appName=KennyNguyen"
);
const app = express();
app.use(express.json());
// Viết API việc đăng ký user.
app.post("/api/v1/users", async (req, res) => {
  try {
    const { userName, email } = req.body;
    if (!userName) throw new Error("userName is required!");
    if (!email) throw new Error("email is required!");

    const existedEmail = await UsersModel.findOne({ email });
    if (existedEmail) throw new Error("Email already exists!");

    const createdUser = await UsersModel.create({
      userName,
      email,
    });
    res.status(201).send({
      data: createdUser,
      message: "Register successful!",
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 2. Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
app.post("/api/v1/posts", async (req, res) => {
  try {
    const { authorId, content } = req.body;
    if (!authorId) throw new Error("author is required");
    if (!content) throw new Error("content is required");

    const existedUser = await UsersModel.findById(authorId);
    if (!existedUser) throw new Error("user is not valid");

    const createPost = await PostsModel.create(req.body);
    res.status(201).send({
      data: createPost,
      message: "create post successfull",
      succcess: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 3. Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
app.put("/api/v1/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, userId } = req.body;
    if (!content) throw new Error("Content is required!");
    if (!userId) throw new Error("User is required!");

    const checkPost = await PostsModel.findById(postId); // hoac dung findOne({postId})
    if (!checkPost) throw new Error("Post not found");

    if (checkPost.authorId.toString() !== userId)
      throw new Error("User is not authorized to edit this post");

    checkPost.content = content;
    await checkPost.save();

    res.status(200).send({
      data: checkPost,
      message: "Post updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 4. Viết API cho phép user được comment vào bài post.
app.post("/api/v1/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, authorId } = req.body;
    if (!content) throw new Error("Content is required!");
    if (!authorId) throw new Error("AuthorId is required!");
    if (!postId) throw new Error("PostId is required!");

    const existedPost = await PostsModel.findById(postId);
    if (!existedPost) throw new Error("Post is not valid");

    const existedUser = await UsersModel.findById(authorId);
    if (!existedUser) throw new Error("User is not valid");

    const createComment = await CommentsModel.create({
      postId,
      content,
      authorId,
    });

    res.status(201).send({
      data: createComment,
      message: "create comment successfull",
      succcess: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 5. Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa).
app.put("/api/v1/comments/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, authorId } = req.body;
    if (!content) throw new Error("Content is required!");
    if (!authorId) throw new Error("AuthorId is required!");

    const existingComment = await CommentsModel.findById(commentId);
    if (!existingComment) throw new Error("Comment is not valid");

    if (existingComment.authorId.toString() !== authorId) {
      throw new Error("User is not authorized to edit this comment");
    }

    existingComment.content = content;
    await existingComment.save();

    res.status(201).send({
      data: existingComment,
      message: "Comment updated successfully",
      succcess: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// 6. Viết API lấy tất cả comment của một bài post.
app.get("/api/v1/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    const existingPost = await PostsModel.findById(postId);
    if (!existingPost) {
      return res.status(404).send({
        message: "Post not found",
        success: false,
        data: null,
      });
    }

    const ALL_COMMENTS = await CommentsModel.find({ postId: postId });

    res.status(200).send({
      data: ALL_COMMENTS,
      message: "Comments retrieved successfully",
      succcess: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to retrieve comments",
      success: false,
      data: null,
    });
  }
});

// 8. Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId.
app.get("/api/v1/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostsModel.findById(postId);
    if (!post) {
      return res.status(404).send({
        message: "Post not found",
        success: false,
        data: null,
      });
    }

    const comments = await CommentsModel.find({ postId: postId });

    res.status(200).send({
      data: {
        post,
        comments,
      },
      message: "Post and comments retrieved successfully",
      succcess: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to retrieve comments",
      success: false,
      data: null,
    });
  }
});

//7. Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user.
app.get("/api/v1/post-with-comments", async (req, res) => {
  try {
    const postsResponse = await PostsModel.find();
    const postWithComments = await Promise.all(
      postsResponse.map(async (post) => {
        const postComments = await CommentsModel.find({
          postId: post._id,
        }).limit(3);
        return {
          ...post.toObject(),
          comments: postComments,
        };
      })
    );
    res.status(200).send({
      message: "Lấy bài viết cùng với ba bình luận đầu thành công",
      data: postWithComments,
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to retrieve comments",
      success: false,
      data: null,
    });
  }
});

app.listen(8080, () => {
  console.log("Server is running!");
});
