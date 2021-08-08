const Transactions = require('../model/Transactions');
const User = require('../model/User');
const {serverError} = require('../utils/error');
module.exports={
    allTransactions(req, res){
        let {_id} = req.user;
        Transactions.find({author: _id})
            .then(transactions=>{
               if(transactions.length===0){
                    res.status(200).json({
                        message: "No Transaction Found"
                    })
               } else {
                   res.status(200).json(transactions)
               }
            })
            .catch(err=> serverError(res, err))
    },
    createTransaction(req, res){
        let {amount, type, note} = req.body;
        let userId = req.user._id;
        let transaction = new Transactions({amount, type, note, author: userId});
        transaction.save()
            .then(trans=>{
                let updatedUser = {...req.user._doc};
                if(type === "income"){
                    updatedUser.balance = updatedUser.balance + amount
                    updatedUser.income = updatedUser.income + amount
                } else if (type ==="expense"){
                    updatedUser.balance = updatedUser.balance - amount
                    updatedUser.expense = updatedUser.expense + amount
                }
                console.log(updatedUser)
                updatedUser.transactions.unshift(trans._id)
                User.findByIdAndUpdate(updatedUser._id, {$set: updatedUser}, {new: true})
                    .then(result=>{      
                        res.status(201).json({
                            message: "transaction created successfully",
                            ...trans._doc,
                            user: result
                        })
                    })
                    .catch(err=>serverError(res, err))
            })
            .catch(err=>serverError(res, err))
    },
    transactionById(req, res){
        let {tId} = req.params;
        Transactions.findById(tId)
            .then(transaction=>{
                if(!transaction){
                    res.status(200).json({
                        message: "No Trunsaction Found"
                    })
                } else {
                    res.status(200).json(transaction)
                }
            })
            .catch(err=>serverError(res, err))
    },
    editTransaction(req, res){
        let {tId} = req.params;
        Transactions.findByIdAndUpdate(tId, {$set: req.body})
            .then(result=>{
                res.status(200).json({
                    message: "Updated Succesfully",
                    ...result
                })
            })
            .catch(err=>serverError(res, err))
    },
    deleteTransaction(req, res){
        let {tId} = req.params;
        Transactions.findOneAndRemove(tId)
            .then(data=>{
                res.status(200).json({
                    message: "Delete Successfully",
                    ...data
                })
            })
            .catch(err=>serverError(res, err))
    }
}