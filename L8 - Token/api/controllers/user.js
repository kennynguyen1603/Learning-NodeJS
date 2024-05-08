import UsersModel from "../models/users.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
const usersController = {
  getAllUser: async (req, res) => {
    const allUsers = await UsersModel.find();
    res.status(200).send({
      data: allUsers,
      message: "Get all user success",
      success: true,
    });
  },
  register: async (req, res) => {
    try {
      const { userName, email, password } = req.body;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      if (!userName) throw new Error("userName is required!");
      if (!email) throw new Error("email is required!");
      if (!password) throw new Error("password is required!");

      const existedEmail = await UsersModel.findOne({ email });
      if (existedEmail) throw new Error("Email already exists!");

      const hashedPassword = await bcrypt.hash(password, salt);

      const createdUser = await UsersModel.create({
        userName,
        email,
        password: hashedPassword,
        // salt,
      });

      res.status(201).send({
        data: createdUser,
        message: "Register successful!",
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
  login: async (req, res) => {
    res.status(200).send({
      data: {
        user: req.user,
        accessToken: req.accessToken,
        refreshToken: req.refreshToken,
      },
      message: "Authentication successful!",
      success: true,
    });
  },
  changePassword: async (req, res) => {
    try {
      const { current_password, new_password } = req.body;

      if (!current_password) throw new Error("Current password is required!");

      if (!new_password) throw new Error("New password is required!");

      const user = await UsersModel.findOne({ _id: req.userId });

      if (!user) throw new Error("User not found!");

      if (!bcrypt.compareSync(current_password, user.password))
        throw new Error("Current password is incorrect");

      // const saltRounds = process.env.SALTROUND;
      // Cập nhật mật khẩu mới
      user.password = bcrypt.hashSync(new_password, 10);

      await user.save();

      res.status(200).send({
        data: user,
        message: "Password changed successfully!",
        success: true,
      });
    } catch (error) {
      return res.status(400).send({
        data: null,
        message: error.message,
        success: false,
      });
    }
  },
  refreshToken: (req, res) => {
    try {
      const user = req.user;
      console.log(user);
      const newAccessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).send({
        accessToken: newAccessToken,
        message: "New access token generated successfully.",
        success: true,
      });
    } catch (error) {
      res.status(400).send({
        data: null,
        message: error.message,
        success: false,
      });
    }
  },
};

export default usersController;
