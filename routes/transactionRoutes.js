const Router = require('express').Router();
const {
    allTransactions,
    createTransaction,
    transactionById,
    editTransaction,
    deleteTransaction
} = require('../Controllers/transactionController');
const authenticate = require('../authenticate');

Router.get('/', authenticate, allTransactions);
Router.post('/', authenticate, createTransaction);
Router.get('/:tId', authenticate, transactionById);
Router.put('/:tId', authenticate, editTransaction);
Router.delete('/:tId', authenticate, deleteTransaction);

module.exports = Router;