const express = require('express');
const Transaction = require('../models/Transaction');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Get all transactions for logged-in user
router.get('/', async (req, res) => {
  try {
    const txns = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json(txns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add transaction
router.post('/', async (req, res) => {
  try {
    const txn = await Transaction.create({ ...req.body, user: req.user._id });
    res.status(201).json(txn);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;