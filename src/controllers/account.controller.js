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

async function getUserAccountsController(req, res) {
  const user = req.user;

  const accounts = await accountModel.find({ user: user._id });

  return res.status(200).json({
    message: "Accounts retrieved successfully",
    accounts,
  });
}

module.exports = {
  createAccountController,
  getUserAccountsController,
};
