const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

//router
const userRouter = require('./routes/userRoutes');
const transactionRouter = require('./routes/transactionRoutes');

const port = process.env.PORT || 4000;
const mongoUri = `mongodb://localhost:27017/money-management`


const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//passport for protect routes
app.use(passport.initialize())
require('./passport')(passport)

app.use('/api/users', userRouter);
app.use('/api/transactions', transactionRouter);

if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'))
    app.get("*",(req, res)=>{ //wildcut request
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}


app.get('/',(req,res)=>{
    res.json({
        message : 'welcome to server'
    })
});


app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
    mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },()=>{
        console.log('database connected');
    })
});