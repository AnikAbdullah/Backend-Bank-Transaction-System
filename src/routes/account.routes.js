const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller");

const router = express.Router();

// POST / api/accounts
router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);

// GET /api/accounts
router.get(
  "/",
  authMiddleware.authMiddleware,
  accountController.getUserAccountsController,
);

module.exports = router;
