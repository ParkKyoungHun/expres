const express = require('express');
const morgan = require('morgan'); 
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const us = require('./service/user_service');
const uc = require('./controller/user_controller');
// var us = new userService();

app.set('port', (process.env.PORT || 3000));

//app.use('/', express.static(__dirname + '/../dist'));
app.use('/scripts', express.static(__dirname + '/../node_modules'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/api/users', uc);


app.listen(app.get('port'), function() {
    console.log('해당포트로 서버실행 =>'+app.get('port'));
});