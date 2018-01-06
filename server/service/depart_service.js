var mysql = require('promise-mysql');
var dbConfig = require('../conf/dbconfig.js');
const con = mysql.createConnection(dbConfig);
var errorHandle = require('../conf/errorHandle');
var rowsHandle = require('../conf/rowsHandle');

var departService = {
    selectDepartList:selectDepartList,
    selectDepart:selectDepart,
    insertDepart:insertDepart,
    deleteDepart:deleteDepart,
    updateDepart:updateDepart
}
module.exports = departService;

function selectDepartList(req){
    var sql = "select diName, diNo, diDesc, diCnt from depart_info";
    return con.then((con)=>{
        return con.query(sql);
    })
    .then(rowsHandle)
    .catch(errorHandle);
}

function deleteDepart(req){
    var sql = "delete from depart_info where diNo=?";
    var diNo = req.params.diNo;
    return con.then((con)=>{
        return con.query(sql,diNo);
    })
    .then(rowsHandle)
    .catch(errorHandle)
}

function selectDepart(req){
    var sql = "select diName, diNo, diDesc, diCnt "
    sql += " from depart_info where diNo=?";
    var diNo = req.params.diNo;
    return con.then((con)=>{
        return con.query(sql,diNo);
    })
    .then(rowsHandle)
    .catch(errorHandle);
}

function updateDepart(req){
    var obj = req.body;
    var values = [obj.diName, obj.diDesc, obj.diCnt,obj.diNo];
    var sql = "update depart_info";
    sql += " set diName=?,";
    sql += " diDesc=?,";
    sql += " diCnt=?";
    sql += " where diNo=?";
    return con.then(con=>{
        return con.query(sql,values);
    }).then(rows=>{
        var result = {};
        result["succeed"] = "ok";
        if(rows.affectedRows!=1){
            result["succeed"]="no";
        }
        return result;
    });
}

function insertDepart(req){
    var obj = req.body;
    var values = [obj.diName, obj.diDesc, obj.diCnt];
    var sql = "insert into depart_info(diname, didesc, dicnt)";
    sql += "values(?,?,?)"
    return con.then(con=>{
        dbCon = con;
        return dbCon.query(sql,values);
    }).then(rows=>{
        var result = {};
        result["succeed"] = "no";
        if(rows.affectedRows==1){
            result["succeed"] = "ok";
        }
        return result;
    })
}