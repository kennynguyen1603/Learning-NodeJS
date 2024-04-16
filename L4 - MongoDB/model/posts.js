import mongoose from "mongoose";
import Collections from "../database/collection.js";

const postsSchema = new mongoose.Schema({
  authorId: String,
  content: String,
});

const PostsModel = mongoose.model(Collections.POSTS, postsSchema);
export default PostsModel;
