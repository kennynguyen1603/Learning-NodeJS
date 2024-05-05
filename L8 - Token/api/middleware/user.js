import UsersModel from "../models/users.js";
import bcrypt from "bcrypt";

const userAuthentication = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("Email is required!");
    if (!password) throw new Error("Password is required!");

    const user = await UsersModel.findOne({ email });
    if (!user) throw new Error("Email or password is incorrect");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Email or password is incorrect!");

    const userObject = user.toObject();
    delete userObject.password;

    req.user = userObject;
    next();
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
};

// export default userAuthentication;
export { userAuthentication };
