import CommentsModel from "../models/comments.js";

const commentController = {
  createComment: async (req, res) => {
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
  },
  updateComment: async (req, res) => {
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
  },
  getAllComment: async (req, res) => {
    try {
      const { postId } = req.params;
      const existingPost = await PostsModel.findById(postId);
      console.log(existingPost);
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
      console.error("Error fetching comments:", error);
      res.status(500).send({
        message: "Failed to retrieve comments",
        success: false,
        data: null,
      });
    }
  },
};

export default commentController;
