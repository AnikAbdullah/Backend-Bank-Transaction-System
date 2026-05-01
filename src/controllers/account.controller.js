const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
  try {
    const user = req.user;

    const account = await accountModel.create({
      user: user._id,
    });

    return res.status(201).json({
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    console.error("Account creation error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating account",
      status: "failed",
    });
  }
}

module.exports = {
  createAccountController,
};
