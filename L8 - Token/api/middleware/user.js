import UsersModel from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const userAuthentication = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("Email is required!");
    if (!password) throw new Error("Password is required!");

    const user = await UsersModel.findOne({ email });
    if (!user) throw new Error("Email or password is incorrect");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Email or password is incorrect!");

    // access token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    // refresh token
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    // delete userObject.refreshToken;
    req.user = userObject;
    req.accessToken = token;
    req.refreshToken = refreshToken;
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
