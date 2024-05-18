import mongoose from "mongoose";
import Collections from "../database/collection.js";

const commentsSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Collections.POSTS,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Collections.USERS,
  },
  content: { type: String },
});

const CommentsModel = mongoose.model(Collections.COMMENTS, commentsSchema);
export default CommentsModel;
