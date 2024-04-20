import UsersModel from "../models/users.js";

const usersController = {
  createNewUser: async (req, res) => {
    try {
      const { userName, email } = req.body;
      if (!userName) throw new Error("userName is required!");
      if (!email) throw new Error("email is required!");

      const existedEmail = await UsersModel.findOne({ email });
      if (existedEmail) throw new Error("Email already exists!");

      const createdUser = await UsersModel.create({
        userName,
        email,
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
};

export default usersController;
