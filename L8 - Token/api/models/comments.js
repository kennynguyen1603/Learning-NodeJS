import mongoose from "mongoose";
import Collections from "../database/collection.js";
const commentsSchema = new mongoose.Schema({
  postId: String,
  content: String,
  authorId: String,
});

const CommentsModel = mongoose.model(Collections.COMMENTS, commentsSchema);
export default CommentsModel;
