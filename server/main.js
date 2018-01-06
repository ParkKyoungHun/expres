const express = require('express');
const morgan = require('morgan'); 
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const header = require('./conf/header');
const menuController = require('./controller/menu_controller');
const departController = require('./controller/depart_controller');
const userController = require('./controller/user_controller');
app.set('port', (process.env.PORT || 3000));
app.use('/scripts', express.static(__dirname + '/../node_modules'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(header);

app.use('/api/menus',menuController);
app.use('/api/departs',departController);
app.use('/api/userdeparts',userController);
app.listen(app.get('port'), function() {
    console.log('express running port : '+app.get('port'));
});