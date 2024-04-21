import PostsModel from "../models/posts.js";
import CommentsModel from "../models/comments.js";
import UsersModel from "../models/users.js";
const postsController = {
  // 2. Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
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

  // 3. Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
  updatePost: async (req, res) => {
    try {
      const { content } = req.body;
      const { post } = req; // Truy cập trực tiếp từ req.post

      if (!content) throw new Error("Content is required!");

      // Cập nhật nội dung và lưu thay đổi
      post.content = content;
      await post.save();

      res.status(200).send({
        data: post,
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

  // 4. Viết API cho phép user được comment vào bài post.
  commentOnPosts: async (req, res) => {
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

  // 6. Viết API lấy tất cả comment của một bài post.
  commentsOfPost: async (req, res) => {
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

  //7. Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user.
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

  // 8. Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId.
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
};

export default postsController;
