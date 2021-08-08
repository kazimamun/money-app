const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../model/User");
const registerValidator = require("../validator/registerValidator");
const loginValidator = require('../validator/loginValidator');
const {serverError, resourseError} = require('../utils/error');

module.exports = {
    login (req, res){
        let email = req.body.email;
        let password = req.body.password;
        let validate = loginValidator({email, password});
        if(!validate.isValid){
            res.status(400).json(validate.error)
        } else {
            User.findOne({email})
                .then(user=>{
                    if(!user){
                        return resourseError(res, "User Not Found")
                    } else {
                        bcrypt.compare(password, user.password, (err, result)=>{
                            if(!result){
                                return resourseError(res, "error occurd")
                            } else {                                
                                let token = jwt.sign({
                                    _id: user._id,
                                    name : user.name,
                                    email: user.email,
                                    amount: user.amount,
                                    income: user.income,
                                    expense: user.expense,
                                    transactions: user.transactions
                                },"SECRET",{expiresIn: "2h"})
                                res.status(200).json({
                                    message: 'login successfull',
                                    token : `Bearer ${token}`
                                })
                            }
                        })
                    }
                })
                .catch(err=>serverError(res, err))
        }
    },

    registration(req, res){
        let {name, email, password, confirmPassword} = req.body;
        let validate = registerValidator({name, email, password, confirmPassword})

        if(!validate.isValid){
            res.status(400).json(validate.error)
        } else {
            User.findOne({email})
                .then(user=>{
                    if(!user){
                        bcrypt.hash(password, 10, (err, hash)=>{
                            if(err){
                                return resourseError(res, "error occurd")
                            } else {
                                const user = new User({
                                    name, 
                                    email, 
                                    password:hash,
                                    balance: 0,
                                    income: 0,
                                    expense: 0,
                                    transactions: []
                                })
                                user.save()
                                    .then(data=>res.status(200).json(data))
                                    .catch(err=>serverError(res, err))
                            }                            
                        })
                    } else {
                        return resourseError(res, "user already registerd")
                    }
                })
                .catch(err=>serverError(res, err))
        }
    },
    allUser(req, res){
        User.find()
            .then(user=>{
                if(!user){
                    return res.status(400).json({
                        message: "user not found"
                    })
                }
                res.status(200).json(user)
            })
            .catch(err=>serverError(res, err))
    }
}