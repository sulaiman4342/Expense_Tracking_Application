const asyncHandler = require("express-async-handler");
const Expense = require("../models/expensesModel");

//@desc Get all expenses
//@route GET /api/expenses
//@access public
const getExpenses = asyncHandler(async (req,res) => {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
});

//@desc Create new expence
//@route POST /api/expences
//@access public
const createExpense = asyncHandler(async (req,res) => {
    console.log("The request body is :" , req.body);
    const { title, category, description, amount, date } = req.body;
    if (!title || !category || !amount || !date){
        res.status(400);
        throw new Error("Complete required fields");
    }

    try{
        const expense = await Expense.create({
            title,
            category,
            description,
            amount,
            date
         });
    return res.status(201).json(expense);


    }
    catch(error){
        res.status(error.status || 500);
        throw new Error(error.message);
    }
  

});

//@desc Get expence by id
//@route GET /api/expences/:id
//@access public
const getExpense = asyncHandler(async (req,res) => {
    try{
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            res.status(404);
            throw new Error("Expense not found");         
        }
        res.status(200).json(expense);

    }
    catch(error){
        res.status(404
        );
        throw new Error(error.message);
    }
   
});

//@desc Update expence by id
//@route PUT /api/expences/:id
//@access public
const updateExpense = asyncHandler(async (req,res) => {
   try{ const expense = await Expense.findById(req.params.id);
    if (!expense) {
        res.status(404);
        throw new Error("Expense not found");         
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        req.body, 
        { new: true }
    );
    res.status(200).json(updatedExpense);}
    catch(error){
        res.status(error.status || 500);
        throw new Error(error.message);
    }
});

//@desc Delete expence by id
//@route DELETE /api/expences/:id
//@access public
const deleteExpense = asyncHandler(async (req,res) => {
    try{
    
        await Expense.findByIdAndDelete(req.params.id);
    
    res.status(200).json({msg : "Expense deleted sucessfully"});}
    catch(error){
        res.status(error.status || 500);
        throw new Error(error.message);
    }
});


// @desc Get expense summary for the current month
// @route GET /api/expenses/summary
// @access public
const getExpenseSummary = asyncHandler(async (req, res) => {
    try {
        const startOfMonth = new Date(new Date().setDate(1));
        const endOfMonth = new Date(new Date().setMonth(new Date().getMonth() + 1, 0));

        const summary = await Expense.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfMonth,
                        $lt: endOfMonth,
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        if (!summary || summary.length === 0) {
            // If no data found, return default empty array for all categories
            const allCategories = [
                "Food",
                "Transportation",
                "Household",
                "Health",
                "Education",
                "Entertainment"
            ];
            const emptySummary = allCategories.map(category => ({
                _id: category,
                totalAmount: 0
            }));
            return res.status(200).json(emptySummary);
        }

        const formattedSummary = summary.map(item => ({
            _id: item._id,
            totalAmount: item.totalAmount
        }));

        const allCategories = [
            "Food",
            "Transportation",
            "Household",
            "Health",
            "Social Life",
            "Miscellaneous"
        ];

        const mergedSummary = allCategories.map(category => {
            const found = formattedSummary.find(item => item._id === category);
            return found ? found : { _id: category, totalAmount: 0 };
        });

        res.status(200).json(mergedSummary);
    } catch (error) {
        res.status(error.status || 500);
        throw new Error(error.message);
    }
});

module.exports = {
    getExpenses,
    createExpense,
    getExpense,
    updateExpense,
    deleteExpense,
    getExpenseSummary
};
