import mongoose from "mongoose";
import Collections from "../database/collection.js";

const usersSchema = new mongoose.Schema({
  userName: String,
  email: String,
});

const UsersModel = mongoose.model(Collections.USERS, usersSchema);
export default UsersModel;
