import mongoose from "mongoose";
import Collections from "../database/collection.js";

const postsSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Collections.USERS,
  },
  content: { type: String },
  file: [String],
  createdAt: { type: Date, default: Date.now },
});

const PostsModel = mongoose.model(Collections.POSTS, postsSchema);
export default PostsModel;
