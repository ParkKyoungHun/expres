var express = require('express');
var router = express.Router();
var mysql = require('promise-mysql');
var dbConfig = require('../conf/dbconfig.js');
const con = mysql.createConnection(dbConfig);
var errorHandle = require('../conf/errorHandle');
var rowsHandle = require('../conf/rowsHandle');

router.get('/',selectUserList);
router.get('/login',loginUser);

module.exports = router;
function selectUserList(req,res,next){
    var sql = "select ui.userNo, ui.userName, ui.userAge, ui.userId, ui.userAddress, diName, di.diNo, diDesc, diCnt from user_info";
    sql +=" ui, depart_info di where ui.dino=di.dino";
    con.then((con)=>{
        return con.query(sql);
    }).catch(errorHandle)
    .then(rowsHandle)
    .then(result=>{
        console.log(result);
        res.json(result);
    });
}
function loginUser(req,res,next){
    var userId = req.query.userId;
    var userPwd = req.query.userPwd;
    var sql = "select userNo, userName, userId, userAge, userPwd, userAddress";
    sql += " from user_info where userId=?";
    con.then((con)=>{
        return con.query(sql,userId);
    })
    .then(rows=>{
        var result = {};
        result["login"] = "no";
        if(rows.length==1){
            var checkPwd = rows[0].userPwd;
            if(userPwd==checkPwd){
                result["login"] = "ok";
                result["list"] = rows;
            }
        }
        return result;
    }).catch(errorHandle)
    .then(result=>{
        console.log(result);
        res.json(result);
    });
}