import UsersModel from "../models/users.js";

const usersController = {
  getAllUser: async (req, res) => {
    const allUsers = await UsersModel.find();
    res.status(200).send({
      data: allUsers,
      message: "Get all user success",
      success: true,
    });
  },
  createNewUser: async (req, res) => {
    res.status(201).send({
      data: req.user,
      message: "Register successful!",
      success: true,
    });
  },
  register: async (req, res) => {
    res.status(201).send({
      data: req.user,
      message: "Register successful!",
      success: true,
    });
  },
};

export default usersController;
