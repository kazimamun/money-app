const validator = require('validator');

const validate = user =>{
    let error = {};

    if(!user.email){
        error.email = 'Please Provide Your Email'
    } else if(!validator.isEmail(user.email)){
        error.email = "please provide a valid email"
    }

    if(!user.password){
        error.password = 'Please Provide a password'
    } else if(user.password.length <6){
        error.password = "please provide password greater or equal then 6 character "
    }
    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate;