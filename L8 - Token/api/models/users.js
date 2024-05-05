import mongoose from "mongoose";
import Collections from "../database/collection.js";

const usersSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    default: "USER",
  },
});

const UsersModel = mongoose.model(Collections.USERS, usersSchema);
export default UsersModel;
