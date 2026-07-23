const express = require('express');
const Budget = require('../models/Budget');
const protect = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const existing = await Budget.findOne({
      user: req.user._id,
      category: req.body.category,
      month: req.body.month,
    });
    if (existing) {
      existing.limit = req.body.limit;
      await existing.save();
      return res.json(existing);
    }
    const budget = await Budget.create({ ...req.body, user: req.user._id });
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;