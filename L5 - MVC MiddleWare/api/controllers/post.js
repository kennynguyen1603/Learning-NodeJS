import PostsModel from "../models/posts.js";
import CommentsModel from "../models/comments.js";
const postsController = {
  createPost: async (req, res) => {
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
  },
  updatePost: async (req, res) => {
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
  },
  getPost: async (req, res) => {
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
  },
  getPostWithComment: async (req, res) => {
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
  },
};

export default postsController;
