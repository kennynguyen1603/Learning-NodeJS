import UsersModel from "../models/users.js";
import bcrypt from "bcrypt";
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
      data: req.user,
      token: req.token,
      message: "Authentication successful!",
      success: true,
    });
  },
};

export default usersController;
