import PostsModel from "../models/posts.js";
import CommentsModel from "../models/comments.js";
import UsersModel from "../models/users.js";
import { authorizePostEditor } from "../middleware/post.js";
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
      const { postId } = req.params;
      const { email } = req.query;

      if (!content || !postId) {
        return res.status(400).send({
          message: "Missing postId or content!",
          data: null,
          success: false,
        });
      }

      const post = await PostsModel.findById(postId);

      if (!post) {
        return res.status(404).send({
          message: "Post not found",
          data: null,
          success: false,
        });
      }

      const user = await UsersModel.findOne({ email });

      if (!user) {
        return res.status(404).send({
          message: "User not found",
          data: null,
          success: false,
        });
      }

      if (
        req.role !== "ADMIN" &&
        post.authorId.toString() !== user._id.toString()
      ) {
        return res.status(403).send({
          message: "Bạn không có quyền chỉnh sửa bài viết này!",
          data: null,
          success: false,
        });
      }

      post.content = content;
      await post.save();

      res.status(200).send({
        data: post,
        message: "Bài viết đã được cập nhật thành công",
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        message: "Đã xảy ra lỗi khi cập nhật bài viết",
        data: null,
        success: false,
      });
    }
  },
  // 4. Viết API cho phép user được comment vào bài post.
  commentOnPosts: async (req, res) => {
    try {
      const { postId } = req.params;
      const { content } = req.body;
      const { email } = req.query;

      const userId = await UsersModel.findOne({ email });

      if (!content) throw new Error("Content is required!");
      if (!postId) throw new Error("PostId is required!");

      const existedPost = await PostsModel.findById(postId);
      if (!existedPost) throw new Error("Post is not valid");

      const createComment = await CommentsModel.create({
        postId,
        content,
        userId,
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

  // Lay post co phan trang
  // getPostPagination: async (req, res) => {
  //   // crr page
  //   const page = parseInt(req.query.page) || 1;

  //   // Số lượng phần tử trên một trang.
  //   const pageSize = parseInt(req.query.pageSize) || 10;
  //   try {
  //     const totalItems = await PostsModel.countDocuments();
  //     const totalPage = Math.ceil(totalItems / pageSize);
  //     const skip = (page - 1) * pageSize;

  //     const posts = await PostsModel.find().skip(skip).limit(pageSize);

  //     res.status(200).send({
  //       totalItems,
  //       totalPage,
  //       pageSize,
  //       currentPage: page,
  //       data: posts,
  //     });
  //   } catch (error) {
  //     res.status(500).send({ error: "An error occurred while fetching posts" });
  //   }
  // },
};

export default postsController;
