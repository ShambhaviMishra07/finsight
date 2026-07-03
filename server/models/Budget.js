const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    limit:    { type: Number, required: true },
    month:    { type: String, required: true }, // e.g. "2024-06"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);