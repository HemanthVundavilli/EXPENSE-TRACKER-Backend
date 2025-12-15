const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Expense = require("../models/Expenses");
const auth = require("../middleware/auth");

/**
 * CREATE EXPENSE
 */

router.post("/", auth, async (req, res) => {
  try {
    const { amount, category, date, paymentMode, notes } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      date,
      paymentMode,
      notes,
    });

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
  console.log("User from token:", req.user);
});

/**
 * GET ALL EXPENSES FOR LOGGED-IN USER
 */
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
  console.log("User from token:", req.user);
});

/**
 * UPDATE EXPENSE
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense)
      return res.status(404).json({ msg: "Expense not found" });

    if (expense.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not allowed" });

    expense.amount = req.body.amount ?? expense.amount;
    expense.category = req.body.category ?? expense.category;
    expense.date = req.body.date ?? expense.date;
    expense.paymentMode =
      req.body.paymentMode ?? expense.paymentMode;
    expense.notes = req.body.notes ?? expense.notes;

    await expense.save();
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE EXPENSE
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense)
      return res.status(404).json({ msg: "Expense not found" });

    if (expense.user.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not allowed" });

    await Expense.deleteOne({ _id: expense._id });

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * MONTHLY SUMMARY
 */
router.get("/summary/monthly", auth, async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(summary);
  } catch (err) {
    console.error("MONTHLY SUMMARY ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;