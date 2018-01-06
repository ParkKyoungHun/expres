var express = require('express');
var router = express.Router();
var mysql = require('promise-mysql');
var dbConfig = require('../conf/dbconfig.js');
const con = mysql.createConnection(dbConfig);

router.get('/',selectUserList);
module.exports = router;
var errorHandle = (err)=>{
    console.log(err);
    var result = {};
    if(err.code){
        result["error"] = {"code" : err.code,
        "no" : err.errno,
        "msg" : err.sqlMessage
        };
    }else{
        result["error"] = err;
    }
    return result;
}
var rowsHandle = (rows)=>{
    var result = {};
    result["list"] = rows;
    return result;
}

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