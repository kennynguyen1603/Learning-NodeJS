import { Router } from "express";
import PostsModel from "../models/posts.js";
import CommentsModel from "../models/comments.js";
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

export default rootRouterV1;
