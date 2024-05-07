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
  changePassword: async (req, res) => {
    try {
      // const { userId } = req.body;
      const { current_password, new_password } = req.body;

      if (!current_password) throw new Error("Current password is required!");

      if (!new_password) throw new Error("New password is required!");

      const user = UsersModel.find((u) => u._id === req.userId);

      if (!user || !bcrypt.compareSync(current_password, user.password)) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Cập nhật mật khẩu mới
      user.password = bcrypt.hashSync(new_password, 10);
      // res.json({ message: "Password changed successfully" });
      await user.save();
      res.status(200).send({
        data: user,
        message: "Change password successful!",
        success: true,
      });
    } catch (error) {}
  },
};

export default usersController;
