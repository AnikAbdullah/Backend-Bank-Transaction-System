const mongoose = require("mongoose");

const tokenBlackListSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required"],
      unique: [true, "Token must be unique"],
    },
  },
  {
    timestamps: true,
  },
);

tokenBlackListSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 },
);

const tokenBlackListModel = mongoose.model(
  "TokenBlackList",
  tokenBlackListSchema,
);

module.exports = tokenBlackListModel;
