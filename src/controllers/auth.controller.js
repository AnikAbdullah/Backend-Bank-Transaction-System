const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function userRegisterController(req, res) {
  const { email, password, name } = req.body;

  const isExists = await userModel.findOne({ email: email });

  if (isExists) {
    return res
      .status(422)
      .json({ message: "Email already exists", status: "failed" });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token, { httpOnly: true });
  return res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
    message: "User registered successfully",
    status: "success",
  });
}

async function userLoginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email: email }).select("+password");

  if (!user) {
    return res.status(402).json({ message: "Invalid email or password" });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token, { httpOnly: true });
  return res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
    message: "User logged in successfully",
    status: "success",
  });
}

module.exports = {
  userRegisterController,
  userLoginController,
};
