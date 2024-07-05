const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema({
        title: {
            type: String,
            required: [true, "Please add the expense title"],
        },
        description: {
            type: String,
            default: ""
        },
        date: {
            type: Date,
            default: Date.now
        },
        category: {
            type: String,
            enum: ["Food", "Household", "Social Life", "Transportation", "Health", "Miscellaneous"],
            required: [true, "Please select the catergory"],
        },
        amount: {
            type: Number,
            required: [true, "Please add the amount"],
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Expense", expenseSchema);