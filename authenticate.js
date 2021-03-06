const passport = require('passport');

module.exports = (req, res, next) => {
    passport.authenticate('jwt', (err, user, info)=>{
        if (err) { 
            console.log(err);
            console.log(info);
            return next(err); 
        }
        if (!user) {
            return res.status(400).json({
                message: "Authentication Failed"
            })
        }
        req.user = user
        return next()
    })(req, res, next)
}