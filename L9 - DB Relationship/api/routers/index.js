import { Router } from "express";
import PostsModel from "../models/posts.js";
import CommentsModel from "../models/comments.js";
import UsersModel from "../models/users.js";
const rootRouterV1 = Router();

rootRouterV1.get("/posts/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;
    // console.log(postId);
    const existingPost = await PostsModel.findById(postId);
    console.log(existingPost);
    if (!existingPost) {
      return res.status(404).send({
        message: "Post not found",
        success: false,
        data: null,
      });
    }
    const allComments = await CommentsModel.find({ postId: postId })
      .populate("authorId")
      .exec();

    res.status(200).send({
      data: allComments,
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

rootRouterV1.post("/posts/:postId/comments", async (req, res) => {
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
export default rootRouterV1;
