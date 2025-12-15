const mongoose = require('mongoose');

const ExpenseSchema = ({
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true},
    category: {type: String, required: true},
    date: {type: Date, required: true},
    paymentMode: {type: String, required: true},
    notes: {type:String, required: true}
});

module.exports = mongoose.model('Expense', ExpenseSchema);