import PostsModel from "../models/posts.js";
const authorizePostEditor = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    if (!userId) throw new Error("User ID is required!");

    const post = await PostsModel.findById(postId);

    if (!post) {
      res.status(404).send({
        message: "Post not found",
        data: null,
        success: false,
      });
      return;
    }

    if (post.authorId.toString() !== userId) {
      res.status(403).send({
        message: "User is not authorized to edit this post",
        data: null,
        success: false,
      });
      return;
    }

    req.post = post;

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export { authorizePostEditor };
