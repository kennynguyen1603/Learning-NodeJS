import mongoose from "mongoose";
import Collections from "../database/collection.js";

const usersSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
  },
  refreshToken: { type: String },
});

const UsersModel = mongoose.model(Collections.USERS, usersSchema);
export default UsersModel;
