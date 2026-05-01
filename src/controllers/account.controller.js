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

async function getAccountBalanceController(req, res) {
  const { accountId } = req.params;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  const balance = await account.getBalance();

  return res.status(200).json({
    message: "Account balance retrieved successfully",
    balance,
  });
}

module.exports = {
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController,
};
