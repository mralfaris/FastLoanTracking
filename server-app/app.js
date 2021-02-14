var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require("mongoose");
const Borrower = require("./off-chain/db-models/Borrower");  
const Lender = require("./off-chain/db-models/Lender");
const DB = require('./off-chain/db');
const onchainConfig = require('./on-chain/configs');
const fastloan = require('./on-chain/fastloanEscrow');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

callDB = () => {
    const borrower = {borrowerId: 2, name: 'Temple', dateOfBirth: '2010-02-09', SIN: '789-654-123', address: 'xyz', phoneNo: '789 654 123', email: 'hello@hello.com'};

    DB.connectToDB();
    DB.createBorrower(borrower);
}

app.get('/ping', function (req, res) {
    console.log('Before calling DB...');
    callDB();
    return res.send('pong');
});

app.get('/request', function (req, res) {
    console.log('Before calling Fastloan...');
    fastloan.init();
    fastloan.submitLoanRequest(onchainConfig.borrowerAccount, 10, 1, 'abc');
    return res.send('success');
});

app.get('/register', function (req, res) {
    console.log('Before calling Fastloan...');
    fastloan.init();
    fastloan.registerLender(onchainConfig.lenderAccount);
    return res.send('success');
});

app.get('/getlender', function (req, res) {
    console.log('Before calling Fastloan...');
    fastloan.init();
    fastloan.getLenders();
    return res.send('success');
});

app.get('/deposit', function (req, res) {
    console.log('Before calling Fastloan...');
    fastloan.init();
    fastloan.depositToEscrow(onchainConfig.lenderAccount, 10000000000000000000);
    return res.send('success');
});

app.get('/approve', function (req, res) {
    console.log('Before calling Fastloan...');
    fastloan.init();
    fastloan.approveLoanRequest('0xb2f7ef517d6d222ec36ff363c5f759f2a52106dfdc6a1a6008d6719e5d8eb641', onchainConfig.lenderAccount, 6);
    return res.send('success');
});

app.get('/transfer', function (req, res) {
    console.log('Before calling Fastloan...');
    fastloan.init();
    fastloan.transferbyEscrowTo(onchainConfig.borrowerAccount, 10000000000000000000, '0xb2f7ef517d6d222ec36ff363c5f759f2a52106dfdc6a1a6008d6719e5d8eb641');
    return res.send('success');
});

app.get('/pay', function (req, res) {
    console.log('Before calling Fastloan...');
    fastloan.init();
    fastloan.recordLoanPayment('0xa8566ea8f4a44f3884f316c0e68fe67d1fbbeae1a6bcfd62d386d6bfa7dd04c5', '1750000000000000000');
    return res.send('success');
});


module.exports = app;