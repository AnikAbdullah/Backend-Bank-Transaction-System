const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

// Create a new transaction
// 10 steps tansfer flow:
// - 1. Validate request
// - 2. Validate impotency key
// - 3. Check account status
// - 4. Derive sender balance from ledger
// - 5. Create transaction [PENDING]
// - 6. Create DEBIT ledger entry
// - 7. Create CREDIT ledger entry
// - 8. Mark transaction status to COMPLETED
// - 9. Commit MongoDB session
// - 10. Send email notification

async function createTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!mongoose.isValidObjectId(toAccount)) {
    return res.status(400).json({ error: "Invalid account id" });
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0" });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
    status: "ACTIVE",
  });

  if (!fromUserAccount) {
    return res.status(404).json({ error: "Active sender account not found" });
  }

  const toUserAccount = await accountModel.findById(toAccount);

  if (!toUserAccount) {
    return res.status(404).json({ error: "Recipient account not found" });
  }

  if (toUserAccount.status !== "ACTIVE") {
    return res.status(400).json({
      error: "Recipient account must be ACTIVE to process transaction",
    });
  }

  if (fromUserAccount._id.equals(toUserAccount._id)) {
    return res
      .status(400)
      .json({ error: "Cannot transfer to the same account" });
  }

  const existingTransaction = await transactionModel.findOne({
    idempotencyKey,
  });

  if (existingTransaction) {
    return res.status(200).json({
      message: "Transaction already processed",
      transaction: existingTransaction,
    });
  }

  const ledgerEntries = await ledgerModel.find({
    account: fromUserAccount._id,
  });
  const senderBalance = ledgerEntries.reduce((balance, entry) => {
    if (entry.type === "CREDIT") {
      return balance + entry.amount;
    }

    return balance - entry.amount;
  }, 0);

  if (senderBalance < numericAmount) {
    return res.status(400).json({
      error: `Insufficient balance. Current balance is ${senderBalance}. Requested amount is ${numericAmount}`,
    });
  }

  const session = await transactionModel.startSession();

  try {
    session.startTransaction();

    const transaction = new transactionModel({
      fromAccount: fromUserAccount._id,
      toAccount: toUserAccount._id,
      amount: numericAmount,
      idempotencyKey,
      status: "PENDING",
    });

    await ledgerModel.create(
      [
        {
          account: fromUserAccount._id,
          transaction: transaction._id,
          type: "DEBIT",
          amount: numericAmount,
        },
        {
          account: toUserAccount._id,
          transaction: transaction._id,
          type: "CREDIT",
          amount: numericAmount,
        },
      ],
      { session, ordered: true },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      message: "Transaction completed successfully",
      transaction,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating transaction",
      status: "failed",
    });
  } finally {
    session.endSession();
  }
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!mongoose.isValidObjectId(toAccount)) {
    return res.status(400).json({ error: "Invalid account id" });
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "Amount must be greater than 0" });
  }

  const toUserAccount = await accountModel.findById(toAccount);

  if (!toUserAccount) {
    return res.status(404).json({ error: "Recipient account not found" });
  }

  const fromAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromAccount) {
    return res.status(404).json({ error: "Sender account not found" });
  }

  const existingTransaction = await transactionModel.findOne({
    idempotencyKey,
  });

  if (existingTransaction) {
    return res.status(200).json({
      message: "Transaction already processed",
      transaction: existingTransaction,
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const transaction = new transactionModel({
      fromAccount: fromAccount._id,
      toAccount: toUserAccount._id,
      amount: numericAmount,
      idempotencyKey,
      status: "PENDING",
    });

    await ledgerModel.create(
      [
        {
          account: fromAccount._id,
          transaction: transaction._id,
          type: "DEBIT",
          amount: numericAmount,
        },
        {
          account: toUserAccount._id,
          transaction: transaction._id,
          type: "CREDIT",
          amount: numericAmount,
        },
      ],
      { session, ordered: true },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      message: "Initial funds transaction completed successfully",
      transaction,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Initial funds transaction error:", error);

    return res.status(500).json({
      message: "Something went wrong while creating initial funds transaction",
      status: "failed",
    });
  } finally {
    session.endSession();
  }
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
