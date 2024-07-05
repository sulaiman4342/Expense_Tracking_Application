const express = require("express");
const router = express.Router();
const { getExpenses, createExpense, getExpense, updateExpense, deleteExpense, getExpenseSummary} = require("../controllers/expenseController");

router.route("/summary").get(getExpenseSummary);

router.route("/").get(getExpenses).post(createExpense);

router.route("/:id").get(getExpense).put(updateExpense).delete(deleteExpense);



module.exports = router;